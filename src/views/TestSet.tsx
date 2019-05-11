import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { withRouter } from 'react-router';
import { getCollectionData, getDocById, getNextId } from '../data-utils';
import {
  TestSet as ITestSet,
  Test,
  TestStatus,
  User,
  Platform,
} from '../types';
import TestPreview from '../components/TestPreview';
import Typography from '@material-ui/core/Typography';
import { getUsers } from '../data/users';
import { getPlatforms } from '../data/platforms';
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PublishIcon from '@material-ui/icons/Publish';
import Select from '../components/Select';
import { MarginH, MarginV } from '../styles';
import { createTestSet } from '../model/test-set';

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

const TestSet = ({
  id,
  onRun,
  history,
  location,
  match,
}: {
  id: string;
  onRun: () => void;
  history: any;
  location: any;
  match: any;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [createdTestSet, setCreatedTestSet] = useState<ITestSet>(
    createTestSet(),
  );

  const { value: testSetsCollection } = useCollection(
    firestore.collection('test-sets'),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection('tests'),
  );

  let isCreating = id === 'create';

  useEffect(() => {
    getUsers().then(setUsers);
    getPlatforms().then(setPlatforms);

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

  function updateTestSet(data: object) {
    if (isCreating) {
      setCreatedTestSet({
        ...createdTestSet,
        ...(data as ITestSet),
      });
    } else {
      const testSet = getDocById(id, testSetsCollection!.docs);
      if (testSet) {
        var testSetRef = firestore.collection('test-sets').doc(testSet.id);
        if (testSetRef) {
          testSetRef.update(data);
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
      return testSet.tests.map(testId => {
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

  function handleUserChange(e: any) {
    updateTestSet({
      user: e.target.value,
    });
  }

  function onSave() {
    if (testSetsCollection) {
      const nextId = getNextId(testSetsCollection!);

      firestore
        .collection('test-sets')
        .add({
          ...createdTestSet,
          id: String(nextId),
        })
        .then(() => {
          history.push(`/test-sets/${nextId}`);
        });
    }
  }

  function getTestSetField(fieldName: string) {
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
          <Button variant="contained" color="primary" onClick={onRun}>
            <MarginV margin="-6px" />
            <PlayArrowIcon />
            <MarginV margin="6px" />
            Run
          </Button>
        </React.Fragment>
      );
    }
  }

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
                data={platforms}
                value={getTestSetField('platform')}
              />
              <MarginV />
              <Select
                title="Assignee"
                name="user"
                onChange={handleUserChange}
                allowNone
                data={users}
                value={getTestSetField('user')}
              />
            </SelectsWrapper>
          </InputsWrapper>
          <ActionsWrapper>{renderActions()}</ActionsWrapper>
        </FormWrapper>
        <Typography variant="h6" component="p">
          Tests
        </Typography>
        <MarginH />
        {getTests().map(
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
