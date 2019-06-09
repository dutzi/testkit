import { action, Action, thunk, Thunk } from 'easy-peasy';
import { firestore, auth } from '../firebase';

export interface WorkspaceModel {
  name: string;
  initializing: boolean;
  setName: Action<WorkspaceModel, string>;
  setInitializing: Action<WorkspaceModel, boolean>;
  init: Thunk<WorkspaceModel>;
}

const workspace: WorkspaceModel = {
  name: 'default',
  initializing: true,
  setName: action((state, payload) => {
    state.name = payload;
    state.initializing = false;
  }),
  setInitializing: action((state, payload) => {
    state.initializing = payload;
  }),
  init: thunk(actions => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const uid = user.uid;

        const cancelSnapshotLisener = firestore
          .doc(`users/${user.uid}`)
          .onSnapshot(async snapshot => {
            const data = snapshot.data();

            actions.setInitializing(false);
            if (data) {
              const workspace = data.workspace;
              actions.setName(workspace);

              cancelSnapshotLisener();
            }
          });
      }
    });
  }),
};

export default workspace;
