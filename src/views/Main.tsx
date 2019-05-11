import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import TestsView from './Tests';
import ArchivedTestsView from './ArchivedTests';
import TestSetsView from './TestSets';
import Navigator from '../components/Navigator';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 256px auto;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  background-color: #f5f7f9;
`;

const MainView = () => {
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default MainView;
