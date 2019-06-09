import { action, Action, thunk, Thunk } from 'easy-peasy';
import { firestore, auth } from '../firebase';
import { Workspace } from '../types';
import { updateWorkspace } from '../clients/workspace';

export interface WorkspaceModel {
  id: string;
  initializing: boolean;
  data?: Workspace;
  setId: Action<WorkspaceModel, string>;
  set: Action<WorkspaceModel, Workspace>;
  setInitializing: Action<WorkspaceModel, boolean>;
  init: Thunk<WorkspaceModel>;
  updateWorkspace: Thunk<WorkspaceModel, Workspace>;
}

const workspace: WorkspaceModel = {
  id: 'default',
  initializing: true,
  setId: action((state, payload) => {
    state.id = payload;
    state.initializing = false;
  }),
  set: action((state, payload) => {
    state.data = payload;
    state.initializing = false;
  }),
  setInitializing: action((state, payload) => {
    state.initializing = payload;
  }),
  init: thunk(actions => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const cancelSnapshotLisener = firestore
          .doc(`users/${user.uid}`)
          .onSnapshot(async snapshot => {
            const data = snapshot.data();

            actions.setInitializing(false);
            if (data) {
              const workspace = data.workspace;
              actions.setId(workspace);

              const workspaceData = (await firestore
                .doc(`workspaces/${workspace}`)
                .get()).data();

              if (workspaceData) {
                actions.set(workspaceData as Workspace);
              }

              cancelSnapshotLisener();
            }
          });
      }
    });
  }),
  updateWorkspace: thunk((actions, payload, { getState }) => {
    actions.set(payload);
    updateWorkspace(getState().id, payload);
  }),
};

export default workspace;
