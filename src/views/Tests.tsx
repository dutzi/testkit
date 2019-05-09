import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ToolbarButton from '../components/ToolbarButton';
import { withRouter } from 'react-router';
import { useCollection } from 'react-firebase-hooks/firestore';
import TestsTable from '../components/TestsTable';
import NewTestView from './NewTest';
import Modal from '../components/Modal';
import Button from '@material-ui/core/Button';
import { FilePlus } from 'react-feather';
import { firestore } from '../firebase';
import { getTestById, updateTest } from '../utils';
import { Test } from '../types';

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
    history.push('/tests/new');
  };

  const handleCloseNewTest = () => {
    history.push('/tests');
  };

  const handleCreateTestSet = () => {};

  function getCollectionData(collection): Test[] {
    if (collection) {
      return collection.docs.map(doc => doc.data());
    } else {
      return [];
    }
  }

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
      const nextId = getNextId(collection!) + index;

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
      <TestsTable
        onOpenTest={handleOpenTest}
        onArchive={handleArchive}
        onDuplicate={handleDuplicate}
        data={getUnarchivedTests(getCollectionData(collection))}
      />
      {showTestModal && (
        <NewTestView
          testId={match.params.testId}
          onClose={handleCloseNewTest}
        />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
