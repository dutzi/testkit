import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useCollection } from 'react-firebase-hooks/firestore';
import TestsTable from '../components/TestsTable';
import TestView from './Test';
import Modal from '../components/Modal';
import Button from '@material-ui/core/Button';
import { FilePlus } from 'react-feather';
import { firestore } from '../firebase';
import {
  getTestById,
  updateTest,
  deleteTest,
  getCollectionData,
} from '../utils';
import { Test } from '../types';
import { createTest } from '../model/test';

const Wrapper = styled.div``;

const Toolbar = styled.div`
  display: flex;
  background-color: var(--background-blue);
  padding: 10px;
`;

const Margin = styled.div`
  margin-right: 10px;
`;

const TestsView = ({
  history,
  location,
  match,
}: {
  history: any;
  location: any;
  match: any;
}) => {
  const { value: collection } = useCollection(firestore.collection('tests'));

  const handleCloseTest = () => {
    history.push('/archived-tests');
  };

  function handleUnarchive(testIds: string[]) {
    testIds.forEach(id => {
      updateTest(
        id,
        {
          state: 'ready',
        },
        collection!,
      );
    });
  }

  function handleDelete(testIds: string[]) {
    testIds.forEach(id => {
      deleteTest(id, collection!);
    });
  }

  const handleAction = (action: string, testIds: string[]) => {
    if (action === 'Delete') {
      handleDelete(testIds);
    } else if (action === 'Unarchive') {
      handleUnarchive(testIds);
    }
  };

  function getArchivedTests(tests: Test[]) {
    return tests.filter(test => test.state === 'archived');
  }

  function handleOpenTest(id: string) {
    history.push(`/archived-tests/${id}`);
  }

  const showTestModal = !!match.params.testId;

  return (
    <Wrapper>
      {/* <Toolbar>
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
      </Toolbar> */}
      <TestsTable
        onOpenTest={handleOpenTest}
        onAction={handleAction}
        data={getArchivedTests(getCollectionData(collection))}
        actions={[
          {
            title: 'Unarchive',
            icon: UnarchiveIcon,
          },
          {
            title: 'Delete',
            icon: DeleteIcon,
          },
        ]}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
