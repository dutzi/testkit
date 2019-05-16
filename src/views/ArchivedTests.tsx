import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import Table from '../components/Table';
import TestView from './Test';
import { updateTest, deleteTest, getCollectionData } from '../data-utils';
import { Test } from '../types';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';
import { WorkspaceContext, TestsCollectionContext } from './Main';
import { navigateTo } from '../utils';

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
  const collection = useContext(TestsCollectionContext);

  const handleCloseTest = (e: React.MouseEvent) => {
    navigateTo('/archived-tests', e, history);
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

  function handleOpenTest(id: string, e: React.MouseEvent) {
    navigateTo(`/archived-tests/${id}`, e, history);
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
        topPadding="150px"
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
