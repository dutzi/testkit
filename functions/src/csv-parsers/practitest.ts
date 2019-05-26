import * as camelcaseKeys from 'camelcase-keys';
import * as csv from 'csvtojson';
import * as changeCase from 'change-case';

function parseRunStatus(status: string) {
  if (status === 'PASSED') {
    return 'passed';
  } else if (status === 'FAILED') {
    return 'failed';
  } else if (status === 'NO RUN' || status === 'N/A') {
    return 'skipped';
  } else {
    console.log('[practitest-importer] missing status mapping', status);
    return '';
  }
}

function createDate(date: string) {
  if (!date) {
    return null;
  } else {
    return new Date(date);
  }
}

export default async function(
  csvFilePath: string,
): Promise<{ tests: any; components: any }> {
  return await csv()
    .fromFile(csvFilePath)
    .then((jsonObj: any) => {
      const ccJsonObj = camelcaseKeys(jsonObj);

      let currentTest: any;
      const tests: any[] = [];
      const components: {
        [componentName: string]: {
          name: string;
          label: string;
          areas: {
            [areaName: string]: {
              name: string;
              label: string;
            };
          };
        };
      } = {};

      ccJsonObj.forEach((testStep: any) => {
        if (!currentTest || testStep.stepPosition === '1') {
          const componentName = changeCase.camelCase(testStep.component);
          const areaName = changeCase.camelCase(testStep.subComponent);
          currentTest = {
            id: testStep.id,
            name: testStep.name,
            description: testStep.description, // practitest-specific
            author: testStep.author, // practitest-specific
            level: testStep.level, // practitest-specific
            state: 'ready',
            status: parseRunStatus(testStep.runStatus),
            created: createDate(testStep.createdAt),
            lastRun: createDate(testStep.lastRun),
            modified: createDate(testStep.updatedAt),
            component: componentName,
            area: areaName,
            steps: [
              {
                id: testStep.stepPosition,
                description: testStep.stepDescription,
                result: testStep.stepExpectedResults,
              },
            ],
          };

          if (!components[componentName]) {
            components[componentName] = {
              name: componentName,
              label: testStep.component,
              areas: {},
            };
          }

          if (areaName && !components[componentName].areas[areaName]) {
            components[componentName].areas[areaName] = {
              name: areaName,
              label: testStep.subComponent,
            };
          }

          tests.push(currentTest);
        } else {
          if (testStep.stepPosition) {
            currentTest.steps.push({
              id: testStep.stepPosition,
              description: testStep.stepDescription,
              result: testStep.stepExpectedResults,
            });
          }
        }
      });

      return {
        tests,
        components: Object.keys(components).map(componentName => {
          const component = components[componentName];
          return {
            name: component.name,
            label: component.label,
            areas: Object.keys(component.areas).map((areaName: string) => {
              const area = component.areas[areaName];
              return {
                name: area.name,
                label: area.label,
              };
            }),
          };
        }),
      };
    });
}
