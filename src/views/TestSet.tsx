import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { firestore } from '../firebase';
import { withRouter } from 'react-router';
import { getCollectionData, getDocById, getNextId } from '../data-utils';
import { TestSet as ITestSet, Test, TestStatus, WorkspaceUser } from '../types';
import TestPreview from '../components/TestPreview';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PublishIcon from '@material-ui/icons/Publish';
import Select, { mapData } from '../components/Select';
import { MarginH, MarginV } from '../styles';
import { createTestSet } from '../model/test-set';
import {
  GlobalUserContext,
  TestsCollectionContext,
  TestSetsCollectionContext,
  WorkspaceContext,
} from './ContextProviders';
import { useUsers } from '../hooks';

const Wrapper = styled.div`
  padding: 24px;
  overflow: auto;
`;

const MaxWidth = styled.div`
  max-width: 1024px;
`;

const SelectsWrapper = styled.div`
  display: flex;
`;

const FormWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
`;

const InputsWrapper = styled.div`
  max-width: 700px;
  flex: 0 1 700px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;
`;

function mapUsers(users: WorkspaceUser[]) {
  return users.map(user => ({ name: user.displayName, id: user.uid }));
}

const TestSet = ({
  id,
  onRun,
  history,
  location,
  match,
}: {
  id: string;
  onRun: (e: React.MouseEvent) => void;
  history: any;
  location: any;
  match: any;
}) => {
  const globalUser = useContext(GlobalUserContext);
  const workspace = useContext(WorkspaceContext)!;
  const users = useUsers();

  const [createdTestSet, setCreatedTestSet] = useState<ITestSet>(
    createTestSet(),
  );
  const testsCollection = useContext(TestsCollectionContext);
  const testSetsCollection = useContext(TestSetsCollectionContext);

  let isCreating = id === 'create';

  useEffect(() => {
    if (isCreating) {
      var searchParams = new URLSearchParams(window.location.search);
      setCreatedTestSet({
        ...createdTestSet,
        tests: (searchParams.get('tests') || '').split(','),
      });
    }
  }, []);

  if (!testSetsCollection || !testsCollection) {
    return null;
  }

  const testSets: ITestSet[] = getCollectionData(testSetsCollection);
  const tests: Test[] = getCollectionData(testsCollection);

  let testSet: ITestSet | undefined;

  if (!isCreating) {
    testSet = testSets.find(testSet => testSet.id === id);
  }

  if ((!testSet && !createdTestSet) || !tests) {
    return null;
  }

  function updateTestSet(data: Partial<ITestSet>) {
    if (isCreating) {
      setCreatedTestSet({
        ...createdTestSet,
        ...(data as ITestSet),
      });
    } else {
      const testSet = getDocById(id, testSetsCollection!.docs);
      if (testSet) {
        var testSetRef = firestore
          .collection(`workspaces/${globalUser.workspace}/test-sets`)
          .doc(testSet.id);
        if (testSetRef) {
          testSetRef.update({ modified: new Date(), ...data });
        }
      }
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTestSet({
      name: e.currentTarget.value,
    });
  }

  function getTests() {
    testSet = isCreating ? createdTestSet : testSet;

    if (testSet) {
      return testSet.tests
        .filter(testId => {
          return !!getDocById(testId, testsCollection!.docs);
        })
        .map(testId => {
          const test = getDocById(testId, testsCollection!.docs);
          return {
            test: test!.data() as Test,
            status: testSet!.status[testId],
          };
        });
    } else {
      return [];
    }
  }

  function handlePlatformChange(e: any) {
    updateTestSet({
      platform: e.target.value,
    });
  }

  function handleAssigneeChange(e: any) {
    updateTestSet({
      assignee: e.target.value,
    });
  }

  function onSave() {
    if (testSetsCollection) {
      const nextId = getNextId(testSetsCollection!);

      firestore
        .collection(`workspaces/${globalUser.workspace}/test-sets`)
        .add({
          ...createdTestSet,
          id: String(nextId),
        })
        .then(() => {
          history.push(`/test-sets/${nextId}`);
        });
    }
  }

  function getTestSetField(fieldName: keyof ITestSet) {
    if (isCreating) {
      return createdTestSet[fieldName];
    } else {
      if (testSet) {
        return testSet[fieldName];
      } else {
        return '';
      }
    }
  }

  function handleRun(e: React.MouseEvent) {
    updateTestSet({ lastRun: new Date() });
    onRun(e);
  }

  function renderActions() {
    if (isCreating) {
      return (
        <React.Fragment>
          <Button variant="contained" color="primary" onClick={onSave}>
            <MarginV margin="-6px" />
            <PublishIcon />
            <MarginV margin="6px" />
            Publish
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button variant="text" color="primary">
            Run&nbsp;Remaining
          </Button>
          <MarginV margin="12px" />
          <Button variant="contained" color="primary" onClick={handleRun}>
            <MarginV margin="-6px" />
            <PlayArrowIcon />
            <MarginV margin="6px" />
            Run
          </Button>
        </React.Fragment>
      );
    }
  }

  const testsInTestSet = getTests();

  return (
    <Wrapper>
      <MaxWidth>
        <FormWrapper>
          <InputsWrapper>
            <TextField
              id="standard-required"
              label="Name"
              margin="normal"
              value={getTestSetField('name')}
              onChange={handleNameChange}
              fullWidth
              autoFocus
            />
            <MarginH />
            <SelectsWrapper>
              <Select
                title="Platform"
                name="platform"
                onChange={handlePlatformChange}
                allowNone
                data={mapData(workspace.platforms)}
                value={getTestSetField('platform')}
              />
              <MarginV />
              <Select
                title="Assignee"
                name="user"
                onChange={handleAssigneeChange}
                allowNone
                data={mapUsers(users)}
                value={getTestSetField('assignee')}
              />
            </SelectsWrapper>
          </InputsWrapper>
          <ActionsWrapper>{renderActions()}</ActionsWrapper>
        </FormWrapper>
        <Typography variant="h6" component="p">
          Tests ({testsInTestSet.length})
        </Typography>
        <MarginH />
        {testsInTestSet.map(
          ({ test, status }: { test: Test; status: TestStatus }) => (
            <TestPreview
              key={test.id}
              test={test}
              status={status}
              showProgress={!isCreating}
            />
          ),
        )}
      </MaxWidth>
    </Wrapper>
  );
};

export default withRouter(TestSet);
