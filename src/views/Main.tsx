import React from 'react';
import styled from 'styled-components';
import { FilePlus, FolderPlus, BookOpen } from 'react-feather';
import { Route, Link } from 'react-router-dom';
import TestsView from './Tests';
import ArchivedTestsView from './ArchivedTests';
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default MainView;
