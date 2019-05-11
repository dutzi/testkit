import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCollection } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import Table from '../components/Table';
import TestView from './Test';
import { firestore } from '../firebase';
import { updateTest, deleteTest, getCollectionData } from '../utils';
import { testSetsTableColumns } from '../data/table-columns';
import TestsSetsTableRow from '../components/TestsSetsTableRow';
import Breadcrumbs from '../components/Breadcrumbs';
import TestSet from './TestSet';

const Wrapper = styled.div``;

const BreadcrumbsWrapper = styled.div`
  padding: 10px;
  background-color: #eaeaea;
`;

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

  function handleOpenTest(id: string) {
    history.push(`/test-sets/${id}`);
  }

  function getCurrentTestSet(collection) {
    if (collection) {
      return getCollectionData(collection).find(
        testSet => testSet.id === match.params.testSetId,
      );
    }
  }

  function getBreadcrumbLocations() {
    if (match.params.testSetId) {
      const testSet = getCurrentTestSet(collection);
      let name = '';
      if (testSet) {
        name = testSet.name || '';
      }
      return [
        { name: 'Test Sets', href: '/test-sets' },
        {
          name,
          href: `/test-sets/${match.params.testSetId}`,
        },
      ];
    } else {
      return [{ name: 'Test Sets', href: '/test-sets' }];
    }
  }

  function handleBreadcrumbClick(location) {
    history.push(location.href);
  }

  const showSingleTestSet = !!match.params.testSetId;

  return (
    <Wrapper>
      <Toolbar>
        <Button variant="contained" color="primary">
          New Test Set
        </Button>
        <Margin />
      </Toolbar>
      <BreadcrumbsWrapper>
        <Breadcrumbs
          onClick={handleBreadcrumbClick}
          locations={getBreadcrumbLocations()}
        />
      </BreadcrumbsWrapper>
      {!showSingleTestSet && (
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
      )}
      {showSingleTestSet && <TestSet id={match.params.testSetId} />}
    </Wrapper>
  );
};

export default withRouter(TestsView);
