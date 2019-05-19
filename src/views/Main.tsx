import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import TestsView from './Tests';
import ArchivedTestsView from './ArchivedTests';
import TestSetsView from './TestSets';
import ProfileView from './Profile';
import SettingsView from './Settings';
import Navigator from '../components/Navigator';
import { auth, firestore } from '../firebase';
import Welcome from './Welcome';
import CreateWorkspace from './CreateWorkspace';
import ContextProviders from './ContextProviders';

export interface GlobalUser {
  workspace: string;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 256px auto;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  background-color: #f5f7f9;
  overflow: auto;
`;

const MainView = () => {
  const { initialising: initializingUser, user } = useAuthState(auth);
  const [globalUser, setGlobalUser] = useState<GlobalUser>({
    workspace: 'default',
  });
  const [initializingWorkspace, setInitializingWorkspace] = useState(true);

  let cancelSnapshotLisener;

  useEffect(() => {
    if (!user) {
      return;
    }

    cancelSnapshotLisener = firestore
      .doc(`users/${user.uid}`)
      .onSnapshot(snapshot => {
        const data = snapshot.data();

        setInitializingWorkspace(false);
        if (data) {
          setGlobalUser({ workspace: data.workspace });
          cancelSnapshotLisener();
        }
      });
  }, [user]);

  if (initializingUser) {
    return null;
  }

  if (!user) {
    return <Welcome />;
  }

  if (initializingWorkspace) {
    return null;
  }

  if (globalUser.workspace === 'default') {
    return <CreateWorkspace />;
  }

  return (
    <ContextProviders user={globalUser}>
      <Wrapper>
        <Navigator />
        <ContentWrapper>
          <Route path="/tests/:testId?" component={TestsView} />
          <Route
            path="/archived-tests/:testId?"
            component={ArchivedTestsView}
          />
          <Route
            path="/test-sets/:testSetId?/:testId?"
            component={TestSetsView}
          />
          <Route path="/settings" component={SettingsView} />
          <Route path="/profile" component={ProfileView} />
        </ContentWrapper>
      </Wrapper>
    </ContextProviders>
  );
};

export default MainView;
