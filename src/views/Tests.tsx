import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { useCollection } from 'react-firebase-hooks/firestore';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Table from '../components/Table';
import TestView from './Test';
import Button from '@material-ui/core/Button';
import { FilePlus } from 'react-feather';
import { firestore } from '../firebase';
import { getTestById, updateTest, getCollectionData } from '../utils';
import { Test } from '../types';
import { createTest } from '../model/test';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';

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

  const handleCreateTest = () => {
    const nextId = getNextId(collection!);

    firestore
      .collection('tests')
      .add(createTest(String(nextId)))
      .then(() => {
        history.push(`/tests/${nextId}`);
      });
  };

  const handleCloseTest = () => {
    history.push('/tests');
  };

  const handleCreateTestSet = () => {};

  function getNextId(tests: firebase.firestore.QuerySnapshot) {
    let maxId = 0;
    tests.docs.forEach(test => {
      if (parseInt(test.data().id) > maxId) {
        maxId = parseInt(test.data().id);
      }
    });

    return maxId + 1;
  }

  const handleDuplicate = (testIds: string[]) => {
    testIds.forEach((id, index) => {
      const test = getTestById(id, collection!.docs);
      const nextId = String(getNextId(collection!) + index);

      if (test) {
        firestore.collection('tests').add({
          ...test.data(),
          id: nextId,
          modified: new Date(),
          lastRun: null,
        });
      }
    });
  };

  const handleArchive = (testIds: string[]) => {
    testIds.forEach(id => {
      updateTest(
        id,
        {
          state: 'archived',
        },
        collection!,
      );
    });
  };

  function handleAction(action: string, testIds: string[]) {
    if (action === 'Duplicate') {
      handleDuplicate(testIds);
    } else if (action === 'Archive') {
      handleArchive(testIds);
    }
  }

  function getUnarchivedTests(tests: Test[]) {
    return tests.filter(test => test.state !== 'archived');
  }

  function handleOpenTest(id: string) {
    history.push(`/tests/${id}`);
  }

  const showTestModal = !!match.params.testId;

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
      <Table
        columns={testsTableColumns}
        onOpenTest={handleOpenTest}
        onAction={handleAction}
        actions={[
          {
            title: 'Duplicate',
            icon: FileCopyIcon,
          },
          {
            title: 'Archive',
            icon: ArchiveIcon,
          },
        ]}
        data={getUnarchivedTests(getCollectionData(collection))}
        rowRenderer={TestsTableRow}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
