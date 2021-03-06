import React from 'react';
import firebase from 'firebase/app';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { GlobalUser } from './Main';
import { GlobalStateProvider } from '../state';
import { Workspace } from '../types';

export interface Platform {
  label: string;
  name: string;
}

export const GlobalUserContext = React.createContext<GlobalUser>({
  workspace: '',
});

export const TestsCollectionContext = React.createContext<
  firebase.firestore.QuerySnapshot | undefined
>(undefined);

export const TestSetsCollectionContext = React.createContext<
  firebase.firestore.QuerySnapshot | undefined
>(undefined);

export const WorkspaceContext = React.createContext<Workspace | undefined>(
  undefined,
);

const ContextProviders = ({
  user,
  children,
}: {
  user: GlobalUser;
  children: React.ReactElement;
}) => {
  const { value: workspace, loading: loadingWorkspace } = useDocument(
    firestore.doc(`workspaces/${user.workspace}`),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection(`workspaces/${user.workspace}/tests`),
  );

  const { value: testSetsCollection } = useCollection(
    firestore.collection(`workspaces/${user.workspace}/test-sets`),
  );

  if (loadingWorkspace) {
    return null;
  }

  return (
    <GlobalStateProvider>
      <TestSetsCollectionContext.Provider value={testSetsCollection}>
        <TestsCollectionContext.Provider value={testsCollection}>
          <GlobalUserContext.Provider value={user}>
            <WorkspaceContext.Provider value={workspace!.data()! as Workspace}>
              {children}
            </WorkspaceContext.Provider>
          </GlobalUserContext.Provider>
        </TestsCollectionContext.Provider>
      </TestSetsCollectionContext.Provider>
    </GlobalStateProvider>
  );
};

export default ContextProviders;
