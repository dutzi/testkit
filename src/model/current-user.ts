import { Action, action, Listen, listen, thunk, Thunk } from 'easy-peasy';
import { Role, WorkspaceUser } from '../types';
import { firestore, auth } from '../firebase';
import workspaceModel from './workspace';

export interface CurrentUserModel {
  data?: Partial<WorkspaceUser>;
  initializing: boolean;
  set: Action<CurrentUserModel, WorkspaceUser>;
  init: Thunk<CurrentUserModel, string>;
  listeners: Listen<CurrentUserModel>;
}

const currentUser: CurrentUserModel = {
  set: action((state, payload) => {
    state.data = payload;
    state.initializing = false;
  }),
  initializing: true,
  init: thunk(async (actions, payload) => {
    const workspace = payload;
    const uid = auth.currentUser!.uid;
    const currentUser = (await firestore
      .doc(`workspaces/${workspace}/users/${uid}`)
      .get()).data();
    if (currentUser) {
      actions.set({ ...(currentUser as WorkspaceUser) });
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

export default currentUser;
