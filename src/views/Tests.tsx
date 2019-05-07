import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ToolbarButton from '../components/ToolbarButton';
import { withRouter } from 'react-router';
import TestsTable from '../components/TestsTable';
import NewTestView from './NewTest';
import Modal from '../components/Modal';
import Button from '@material-ui/core/Button';
import { FilePlus } from 'react-feather';

const Wrapper = styled.div``;

const Toolbar = styled.div`
  display: flex;
  background-color: var(--background-blue);
  padding: 10px;
`;

const Margin = styled.div`
  margin-right: 10px;
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
        <Button onClick={handleCreateTest} variant="contained" color="primary">
          New Test
        </Button>
        <Margin />
        <Button
          onClick={handleCreateTestSet}
          variant="contained"
          color="default"
        >
          Create Test Set
        </Button>
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
