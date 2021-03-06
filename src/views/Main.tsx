import React from 'react';
import styled from 'styled-components';
import { useStore } from '../store';
import { Route, Redirect } from 'react-router-dom';
import TestsView from './Tests';
import ArchivedTestsView from './ArchivedTests';
import TestSetsView from './TestSets';
import ProfileView from './Profile';
import SettingsView from './Settings';
import Navigator from '../components/Navigator';
import Welcome from './Welcome';
import CreateWorkspace from './CreateWorkspace';
import ContextProviders from './ContextProviders';
import media from '../media-queries';

export interface GlobalUser {
  workspace: string;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 256px auto;
  height: 100vh;

  ${media.mobile`
    grid-template-columns: auto;
  `}
`;

const ContentWrapper = styled.div`
  background-color: #f5f7f9;
  overflow: auto;
`;

const MainView = () => {
  const currentUser = useStore(state => state.currentUser.data);
  const workspace = useStore(state => state.workspace.name);
  const initializingCurrentUser = useStore(
    state => state.currentUser.initializing,
  );
  const initializingWorkspace = useStore(state => state.workspace.initializing);

  if (initializingCurrentUser) {
    return null;
  }

  if (!currentUser) {
    return <Welcome />;
  }

  if (initializingWorkspace) {
    return null;
  }

  if (workspace === 'default') {
    return <CreateWorkspace />;
  }

  return (
    <ContextProviders user={{ workspace }}>
      <Wrapper>
        <Navigator />
        <ContentWrapper>
          <Route exact path="/" render={() => <Redirect to="/tests" />} />

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
