import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useCollection } from 'react-firebase-hooks/firestore';
import Table from '../components/Table';
import TestView from './Test';
import { firestore } from '../firebase';
import { updateTest, deleteTest, getCollectionData } from '../utils';
import { Test } from '../types';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';

const Wrapper = styled.div``;

const TestsView = ({
  history,
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
      <Table
        columns={testsTableColumns}
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
        rowRenderer={TestsTableRow}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
