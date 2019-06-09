import { Action, action, Listen, listen, thunk, Thunk } from 'easy-peasy';
import _ from 'lodash';
import { Test } from '../types';
import { firestore, auth } from '../firebase';
import workspaceModel from './workspace';
import { StoreModel } from '.';
import { getNextIdArray } from '../clients/utils';
import { createTest } from './test';

async function updateTestBED(
  workspaceId: string,
  testId: string,
  test: Partial<Test>,
) {
  const testsCollectionRef = firestore.collection(
    `workspaces/${workspaceId}/tests`,
  );
  const testsCollection = await firestore
    .collection(`workspaces/${workspaceId}/tests`)
    .get();

  const doc = testsCollection.docs.find(doc => doc.data().id === testId);
  if (doc) {
    testsCollectionRef.doc(doc.id).update(test);
  }
}

const debouncedUpdateTestBED = _.debounce(updateTestBED, 1000);

export interface TestsModel {
  data?: Test[];
  set: Action<TestsModel, Test[]>;
  init: Thunk<TestsModel, string>;
  addTestAction: Action<TestsModel, Test>;
  addTest: Thunk<TestsModel, undefined, any, StoreModel>;
  duplicateTest: Thunk<TestsModel, Test, any, StoreModel>;
  updateTestAction: Action<TestsModel, { id: string; test: Partial<Test> }>;
  updateTest: Thunk<
    TestsModel,
    { id: string; test: Partial<Test>; debounce?: boolean },
    any,
    StoreModel
  >;
  deleteTestAction: Action<TestsModel, string>;
  deleteTest: Thunk<TestsModel, string, any, StoreModel>;
  listeners: Listen<TestsModel>;
}

const Tests: TestsModel = {
  set: action((state, payload) => {
    state.data = payload;
  }),

  init: thunk(async (actions, payload) => {
    const workspace = payload;
    const tests = await firestore
      .collection(`workspaces/${workspace}/tests`)
      .get();

    actions.set(tests.docs.map(testDoc => testDoc.data() as Test));
  }),

  addTestAction: action((state, payload) => {
    state.data = state.data || [];
    state.data.push(payload);
  }),

  addTest: thunk(async (actions, payload, { getState, getStoreState }) => {
    const state = getState();
    const workspaceId = getStoreState().workspace.id;

    const nextId = getNextIdArray(state.data);
    const test = createTest(String(nextId));

    actions.addTestAction(test);

    await firestore.collection(`workspaces/${workspaceId}/tests`).add(test);

    return nextId;
  }),

  duplicateTest: thunk(
    async (actions, payload, { getState, getStoreState }) => {
      const state = getState();
      const workspaceId = getStoreState().workspace.id;

      const nextId = getNextIdArray(state.data);

      const test = {
        ...payload,
        id: String(nextId),
        modified: new Date(),
        lastRun: null,
      };

      actions.addTestAction(test);

      await firestore.collection(`workspaces/${workspaceId}/tests`).add(test);

      return nextId;
    },
  ),

  updateTestAction: action((state, payload) => {
    if (state.data) {
      state.data = state.data.map(test => {
        if (test.id === payload.id) {
          return { ...test, ...payload.test };
        } else {
          return test;
        }
      });
    }
  }),

  updateTest: thunk(async (actions, payload, { getStoreState }) => {
    const workspaceId = getStoreState().workspace.id;
    actions.updateTestAction(payload);

    if (payload.debounce) {
      // debouncedUpdateTestBED(workspaceId, payload.id, payload.test);
    } else {
      // updateTestBED(workspaceId, payload.id, payload.test);
    }
  }),

  deleteTestAction: action((state, payload) => {
    if (state.data) {
      state.data = state.data.filter(test => test.id !== payload);
    }
  }),

  deleteTest: thunk(async (actions, payload, { getStoreState }) => {
    const workspaceId = getStoreState().workspace.id;
    const testId = payload;

    actions.deleteTestAction(payload);

    const testsCollection = await firestore
      .collection(`workspaces/${workspaceId}/tests`)
      .get();

    const doc = testsCollection.docs.find(doc => doc.data().id === testId);

    if (doc) {
      await firestore.doc(`workspaces/${workspaceId}/tests/${doc.id}`).delete();
    }
  }),

  listeners: listen(on => {
    on(
      workspaceModel.setId,
      thunk((actions, payload) => {
        actions.init(payload);
      }),
    );
  }),
};

export default Tests;
