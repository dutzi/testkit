import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useCollection } from 'react-firebase-hooks/firestore';
import Table from '../components/Table';
import TestView from './Test';
import { firestore } from '../firebase';
import { updateTest, deleteTest, getCollectionData } from '../data-utils';
import { Test } from '../types';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';
import { WorkspaceContext } from './Main';

const Wrapper = styled.div``;

const ArchivedTestsView = ({
  history,
  match,
}: {
  history: any;
  location: any;
  match: any;
}) => {
  const workspace = useContext(WorkspaceContext);
  const [selected, setSelected] = useState<string[]>([]);

  const { value: collection } = useCollection(
    firestore.collection(`workspaces/${workspace}/tests`),
  );

  const handleCloseTest = () => {
    history.push('/archived-tests');
  };

  function handleUnarchive(testIds: string[]) {
    testIds.forEach(id => {
      updateTest(
        id,
        workspace,
        {
          state: 'ready',
        },
        collection!,
      );
    });
    setSelected([]);
  }

  function handleDelete(testIds: string[]) {
    testIds.forEach(id => {
      deleteTest(id, workspace, collection!);
    });
    setSelected([]);
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
        selected={selected}
        setSelected={setSelected}
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
        rowRenderer={props => (
          <TestsTableRow workspace={workspace} {...props} />
        )}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(ArchivedTestsView);
