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

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  background-color: #f5f7f9;
`;

const Button = styled.div`
  color: #727694;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  margin: 0px 10px 20px;
  text-align: center;
`;

const ButtonLabel = styled.div`
  margin-top: 10px;
`;

const MainView = () => {
  const buttons = [
    {
      icon: FilePlus,
      label: 'New Test',
      name: 'new-test',
    },
    {
      icon: FolderPlus,
      label: 'New Test Set',
      name: 'new-test-set',
    },
    {
      icon: BookOpen,
      label: 'Tests',
      name: 'tests',
    },
  ];

  return (
    <Wrapper>
      {/* <Sidebar>
        {buttons.map(button => (
          <Link
            key={button.name}
            to={`/${button.name}`}
            style={{ textDecoration: 'none' }}
          >
            <Button>
              <button.icon size="24" color="#554DF5" />
              <ButtonLabel>{button.label}</ButtonLabel>
            </Button>
          </Link>
        ))}
      </Sidebar> */}
      <Navigator />
      <ContentWrapper>
        <Route exact path="/new-test" component={NewTestView} />
        <Route path="/tests/:testId?" component={TestsView} />
      </ContentWrapper>
    </Wrapper>
  );
};

export default MainView;
