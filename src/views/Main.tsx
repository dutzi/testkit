import React from 'react';
import styled from 'styled-components';
import { FilePlus, FolderPlus, BookOpen } from 'react-feather';
import { Route, Link } from 'react-router-dom';
import NewTestView from './NewTest';
import TestsView from './Tests';
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
        <Route exact path="/new-test" component={NewTestView} />
        <Route path="/tests/:testId?" component={TestsView} />
      </ContentWrapper>
    </Wrapper>
  );
};

export default MainView;
