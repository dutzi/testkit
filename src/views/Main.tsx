import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import TestsView from './Tests';
import ArchivedTestsView from './ArchivedTests';
import TestSetsView from './TestSets';
import ProfileView from './Profile';
import Navigator from '../components/Navigator';
import { auth, firestore } from '../firebase';
import Welcome from './Welcome';
import CreateWorkspace from './CreateWorkspace';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 256px auto;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  background-color: #f5f7f9;
`;

const MainView = () => {
  const { initialising: initializingUser, user } = useAuthState(auth);
  const [workspace, setWorkspace] = useState(null);
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
          setWorkspace(data.workspace);
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

  if (!workspace) {
    return <CreateWorkspace />;
  }

  return (
    <Wrapper>
      <Navigator />
      <ContentWrapper>
        <Route path="/tests/:testId?" component={TestsView} />
        <Route path="/archived-tests/:testId?" component={ArchivedTestsView} />
        <Route
          path="/test-sets/:testSetId?/:testId?"
          component={TestSetsView}
        />
        <Route path="/profile" component={ProfileView} />
      </ContentWrapper>
    </Wrapper>
  );
};

export default MainView;
