import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import ArchiveIcon from '@material-ui/icons/Archive';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Table from '../components/Table';
import TestView from './Test';
import Button from '@material-ui/core/Button';
import { firestore } from '../firebase';
// import { updateTest } from '../clients/test';
import { getNextIdArray } from '../clients/utils';
import { getCollectionData } from '../clients/utils';
import { getDocById } from '../clients/utils';
import { Test } from '../types';
import { createTest } from '../model/test';
import { testsTableColumns } from '../data/table-columns';
import TestsTableRow from '../components/TestsTableRow';
import { GlobalUserContext, TestsCollectionContext } from './ContextProviders';
import { navigateTo } from '../utils';
import MenuButton from '../components/MenuButton';
import { useStore, useActions } from '../store';

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
  const tests = useStore(state => state.tests.data);
  const addTest = useActions(state => state.tests.addTest);
  const updateTest = useActions(state => state.tests.updateTest);
  const duplicateTest = useActions(state => state.tests.duplicateTest);
  const [selected, setSelected] = useState<string[]>([]);

  if (!tests) {
    return null;
  }

  const handleCreateTest = (e: React.MouseEvent) => {
    addTest().then(testId => {
      navigateTo(`/tests/${testId}`, e, history);
    });
  };

  const handleCloseTest = (e: React.MouseEvent | null) => {
    navigateTo('/tests', e, history);
  };

  const handleCreateTestSet = (e: React.MouseEvent) => {
    navigateTo(`/test-sets/create?tests=${selected.join(',')}`, e, history);
  };

  const handleDuplicate = (testIds: string[]) => {
    testIds.forEach((id, index) => {
      const test = tests.find(test => test.id === id);

      if (test) {
        duplicateTest(test);
      }
    });
  };

  const handleArchive = (testIds: string[]) => {
    testIds.forEach(id => {
      updateTest({
        id,
        test: { state: 'archived' },
      });
    });
    setSelected([]);
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

  function handleOpenTest(id: string, e: React.MouseEvent) {
    navigateTo(`/tests/${id}`, e, history);
  }

  const showTestModal = !!match.params.testId;

  return (
    <Wrapper>
      <Toolbar>
        <MenuButton />
        <Button onClick={handleCreateTest} variant="contained" color="primary">
          New Test
        </Button>
        <Margin />
        <Button
          disabled={selected.length === 0}
          onClick={handleCreateTestSet}
          variant="contained"
          color="primary"
        >
          Create Test Set
        </Button>
      </Toolbar>
      <Table
        selected={selected}
        setSelected={setSelected}
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
        data={getUnarchivedTests(tests)}
        rowRenderer={props => <TestsTableRow {...props} />}
        topPadding="210px"
      />
      {showTestModal && (
        <TestView testId={match.params.testId} onClose={handleCloseTest} />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
