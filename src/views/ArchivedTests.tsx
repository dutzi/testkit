import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import Table from '../components/Table';
import TestView from './Test';
import { updateTest, deleteTest } from '../clients/test';
import { getCollectionData } from '../clients/utils';
import { Test } from '../types';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';
import { GlobalUserContext, TestsCollectionContext } from './ContextProviders';
import { navigateTo } from '../utils';
import { Toolbar } from '../styles';
import MenuButton from '../components/MenuButton';

const Wrapper = styled.div``;

const ArchivedTestsView = ({
  history,
  match,
}: {
  history: any;
  location: any;
  match: any;
}) => {
  const globalUser = useContext(GlobalUserContext);
  const [selected, setSelected] = useState<string[]>([]);
  const collection = useContext(TestsCollectionContext);

  const handleCloseTest = (e: React.MouseEvent | null) => {
    navigateTo('/archived-tests', e, history);
  };

  function handleUnarchive(testIds: string[]) {
    testIds.forEach(id => {
      updateTest(
        id,
        globalUser.workspace,
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
      deleteTest(id, globalUser.workspace, collection!);
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
      <Toolbar>
        <MenuButton />
      </Toolbar>
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
          <TestsTableRow workspace={globalUser.workspace} {...props} />
        )}
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(ArchivedTestsView);
