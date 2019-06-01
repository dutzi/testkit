import { useContext, useState, useEffect } from 'react';
import produce from 'immer';
import {
  Test,
  Step as IStep,
  TestSet,
  TestStatus,
  StepStatus,
  StepStatusWithMessage,
} from '../../types';
import _ from 'lodash';
import {
  GlobalUserContext,
  TestsCollectionContext,
  TestSetsCollectionContext,
} from '../ContextProviders';
import { updateTest } from '../../clients/test';
import { getDocById, getCollectionData } from '../../clients/utils';
import { updateTestSet } from '../../clients/test-set';

function getOverallTestStatus(test: TestStatus): StepStatus {
  function hasStepWithStatus(status?: StepStatus) {
    return Object.keys(test).find(stepId => test[stepId].status === status);
  }

  if (hasStepWithStatus('failed')) {
    return 'failed';
  } else if (hasStepWithStatus('skipped') || hasStepWithStatus()) {
    return 'skipped';
  } else {
    return 'passed';
  }
}

const debouncedUpdateTestSet = _.debounce(updateTestSet, 1000);
const debouncedUpdateTest = _.debounce(updateTest, 1000);

export function useTestRunner(testSetId: string, testId: string) {
  const globalUser = useContext(GlobalUserContext);
  const testsCollection = useContext(TestsCollectionContext);
  const testSetsCollection = useContext(TestSetsCollectionContext);

  const testSetDoc = getDocById(testSetId, testSetsCollection!.docs);

  const [test, setTest] = useState<Test | undefined>();
  const [testSet, setTestSet] = useState<TestSet | undefined>();

  useEffect(() => {
    const testSets: TestSet[] = getCollectionData(testSetsCollection);

    setTestSet(testSets.find(testSet => testSet.id === testSetId));
  }, [testSetsCollection]);

  useEffect(() => {
    const tests: Test[] = getCollectionData(testsCollection);

    setTest(tests.find(test => test.id === testId));
  }, [testsCollection]);

  function updateStepStatus(
    step: IStep,
    status: Partial<StepStatusWithMessage>,
  ) {
    if (testSet && testSetDoc && testSetsCollection && testsCollection) {
      const nextState = produce(testSet, draftState => {
        draftState.status[testId] = draftState.status[testId] || {};
        draftState.status[testId][step.id] = {
          ...draftState.status[testId][step.id],
          ...status,
        };
      });

      debouncedUpdateTestSet(
        testSet.id,
        globalUser.workspace,
        nextState,
        testSetsCollection,
      );
      setTestSet(nextState);

      const overallTestStatus = getOverallTestStatus(nextState.status[testId]);

      debouncedUpdateTest(
        testId,
        globalUser.workspace,
        {
          lastRun: new Date(),
          status: overallTestStatus,
        },
        testsCollection,
        false,
      );
    }
  }

  return {
    updateStepStatus,
    test,
    testSet,
  };
}
