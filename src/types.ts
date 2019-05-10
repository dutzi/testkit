export interface Area {
  name: string;
  label: string;
}

export interface Component {
  name: string;
  label: string;
  areas: Area[];
}

export interface Step {
  id: string;
  description: string;
  result: string;
}

export interface Test {
  id: string;
  name: string;
  state: string;
  status: string;
  lastRun: object | null;
  modified: object | null;
  component: string;
  area: string;
  steps: Step[];
}

export type StepStatus = 'passed' | 'failed' | 'no-run';

export interface TestSet {
  id: string;
  name: string;
  lastRun: any | null;
  status: {
    [testId: string]: {
      [testStepId: string]: {
        message: string;
        status: StepStatus;
      };
    };
  };
  tests: string[];
}
