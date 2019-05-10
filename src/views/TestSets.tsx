import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useCollection } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import Table from '../components/Table';
import TestView from './Test';
import { firestore } from '../firebase';
import { updateTest, deleteTest, getCollectionData } from '../utils';
import { Test } from '../types';
import { createTest } from '../model/test';
import { testsTableColumns, testSetsTableColumns } from '../data/table-columns';
import TestsSetsTableRow from '../components/TestsSetsTableRow';

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
  match,
}: {
  history: any;
  location: any;
  match: any;
}) => {
  const { value: collection } = useCollection(
    firestore.collection('test-sets'),
  );

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
      <Toolbar>
        <Button variant="contained" color="primary">
          New Test Set
        </Button>
        <Margin />
      </Toolbar>
      <Table
        columns={testSetsTableColumns}
        onOpenTest={handleOpenTest}
        onAction={handleAction}
        data={getCollectionData(collection)}
        actions={[
          {
            title: 'Delete',
            icon: DeleteIcon,
          },
        ]}
        rowRenderer={TestsSetsTableRow}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
