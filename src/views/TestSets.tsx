import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Table from '../components/Table';
import { firestore } from '../firebase';
import { getCollectionData, getDocById, deleteTestSet } from '../data-utils';
import { testSetsTableColumns } from '../data/table-columns';
import TestsSetsTableRow from '../components/TestsSetsTableRow';
import Breadcrumbs from '../components/Breadcrumbs';
import TestSet from './TestSet';
import TestRunner from './TestRunner';
import { TestSet as ITestSet } from '../types';
import {
  GlobalUserContext,
  TestsCollectionContext,
  TestSetsCollectionContext,
} from './ContextProviders';
import { navigateTo } from '../utils';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100vh;
`;

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
  const [selected, setSelected] = useState<string[]>([]);
  const globalUser = useContext(GlobalUserContext);
  const testsCollection = useContext(TestsCollectionContext);
  const testSetsCollection = useContext(TestSetsCollectionContext);

  if (!testSetsCollection || !testsCollection) {
    return null;
  }

  function handleDelete(testSetIds: string[]) {
    testSetIds.forEach(id => {
      deleteTestSet(id, globalUser.workspace, testSetsCollection!);
    });
  }

  const handleAction = (action: string, testIds: string[]) => {
    if (action === 'Delete') {
      handleDelete(testIds);
    }
    setSelected([]);
  };

  function handleOpenTest(id: string, e: React.MouseEvent) {
    navigateTo(`/test-sets/${id}`, e, history);
  }

  function getCurrentTestSet(collection): ITestSet | undefined {
    if (collection) {
      return getCollectionData(collection).find(
        testSet => testSet.id === match.params.testSetId,
      );
    }
  }

  function getBreadcrumbLocations() {
    function getTestSetName() {
      if (match.params.testSetId === 'create') {
        return 'Create Test Set';
      }

      const testSet = getCurrentTestSet(testSetsCollection);
      let name = '';
      if (testSet) {
        name = testSet.name || '';
      }
      return name;
    }

    function getTestName() {
      const test = getDocById(match.params.testId, testsCollection!.docs);
      let name = '';
      if (test) {
        name = test.data().name || '';
      }

      return name;
    }

    if (match.params.testId) {
      return [
        { name: 'Test Sets', href: '/test-sets' },
        {
          name: getTestSetName(),
          href: `/test-sets/${match.params.testSetId}`,
        },
        {
          name: getTestName(),
          href: `/test-sets/${match.params.testSetId}`,
        },
      ];
    } else if (match.params.testSetId) {
      return [
        { name: 'Test Sets', href: '/test-sets' },
        {
          name: getTestSetName(),
          href: `/test-sets/${match.params.testSetId}`,
        },
      ];
    } else {
      return [{ name: 'Test Sets', href: '/test-sets' }];
    }
  }

  function handleBreadcrumbClick(location, e: React.MouseEvent) {
    navigateTo(location.href, e, history);
  }

  function handleRun(e: React.MouseEvent) {
    const testSet = getCurrentTestSet(testSetsCollection);
    if (testSet) {
      navigateTo(
        `/test-sets/${match.params.testSetId}/${testSet.tests[0]}`,
        e,
        history,
      );
    }
  }

  function handleNextTest(e: React.MouseEvent) {
    const testSet = getCurrentTestSet(testSetsCollection);
    if (testSet) {
      const testIndex = getTestIndex();

      if (testIndex === testSet.tests.length - 1) {
        navigateTo(`/test-sets`, e, history);
      } else {
        navigateTo(
          `/test-sets/${match.params.testSetId}/${
            testSet.tests[testIndex + 1]
          }`,
          e,
          history,
        );
      }
    }
  }

  function handlePrevTest() {
    const testSet = getCurrentTestSet(testSetsCollection);
    if (testSet) {
      const testIndex = getTestIndex();

      history.push(
        `/test-sets/${match.params.testSetId}/${testSet.tests[testIndex - 1]}`,
      );
    }
  }

  function getTestIndex() {
    const testSet = getCurrentTestSet(testSetsCollection);
    if (testSet) {
      return testSet.tests.findIndex(testId => testId === match.params.testId);
    }
    return -1;
  }

  function getNumTests() {
    const testSet = getCurrentTestSet(testSetsCollection);
    if (testSet) {
      return testSet.tests.length;
    }
    return 0;
  }

  const showSingleTestSet = !!match.params.testSetId;
  const showTestRunner = !!match.params.testId;

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
      {!showSingleTestSet && !showTestRunner && (
        <Table
          selected={selected}
          setSelected={setSelected}
          columns={testSetsTableColumns}
          onOpenTest={handleOpenTest}
          onAction={handleAction}
          data={getCollectionData(testSetsCollection)}
          actions={[
            {
              title: 'Delete',
              icon: DeleteIcon,
            },
          ]}
          rowRenderer={TestsSetsTableRow}
          topPadding="250px"
        />
      )}
      {showSingleTestSet && !showTestRunner && (
        <TestSet id={match.params.testSetId} onRun={handleRun} />
      )}
      {showTestRunner && (
        <TestRunner
          testSetId={match.params.testSetId}
          testId={match.params.testId}
          onNext={handleNextTest}
          onPrev={handlePrevTest}
          testIndex={getTestIndex()}
          numTests={getNumTests()}
        />
      )}
    </Wrapper>
  );
};

export default withRouter(TestsView);
