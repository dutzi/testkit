import { firestore } from '../firebase';
import { updateTest } from './test';
import produce from 'immer';
import { StepStatus, TestStatus, StepStatusWithMessage } from '../types';
import _ from 'lodash';

export function updateStepStatus(
  testId: string,
  stepId: string,
  testSetDoc: firebase.firestore.QueryDocumentSnapshot | undefined,
  status: Partial<StepStatusWithMessage>,
  workspace: string,
  testsCollection: firebase.firestore.QuerySnapshot,
) {
  if (testSetDoc) {
    var testSetRef = firestore
      .collection(`workspaces/${workspace}/test-sets`)
      .doc(testSetDoc.id);
    if (testSetRef) {
      // const testSet = testSetDoc.data();
      // const nextState = produce(testSet, draftState => {
      //   draftState.status[testId] = draftState.status[testId] || {};
      //   draftState.status[testId][stepId] = {
      //     ...draftState.status[testId][stepId],
      //     ...status,
      //   };
      // });
      // testSetRef.update(nextState);
      // const overallTestStatus = getOverallTestStatus(nextState.status[testId]);
      // updateTest(
      //   testId,
      //   workspace,
      //   {
      //     lastRun: new Date(),
      //     status: overallTestStatus,
      //   },
      //   testsCollection,
      //   false,
      // );
    }
  }
}
