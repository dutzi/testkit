import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ToolbarButton from '../components/ToolbarButton';
import { withRouter } from 'react-router';
import TestsTable from '../components/TestsTable';
import NewTestView from './NewTest';
import Modal from '../components/Modal';

const Wrapper = styled.div``;

const Toolbar = styled.div`
  background-color: var(--background-dark);
`;

const TestsView = ({ history, location }: { history: any; location: any }) => {
  const handleCreateTest = () => {
    history.push('/tests/new');
  };

  const handleCloseNewTest = () => {
    history.push('/tests');
  };

  const handleCreateTestSet = () => {};

  const showNewTestModal = location.pathname === '/tests/new';

  return (
    <Wrapper>
      <Toolbar>
        <ToolbarButton
          label="New Test"
          icon="FilePlus"
          onClick={handleCreateTest}
        />
        <ToolbarButton
          label="Create Test Set"
          icon="FolderPlus"
          onClick={handleCreateTestSet}
        />
      </Toolbar>
      <TestsTable />
      {showNewTestModal && (
        <Modal onClose={handleCloseNewTest}>
          <NewTestView />
        </Modal>
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
