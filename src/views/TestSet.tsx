import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { getCollectionData, getDocById } from '../data-utils';
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
import Select from '../components/Select';
import { MarginH, MarginV } from '../styles';

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

const TestSet = ({ id, onRun }: { id: string; onRun: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const { value: testSetsCollection } = useCollection(
    firestore.collection('test-sets'),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection('tests'),
  );

  useEffect(() => {
    getUsers().then(setUsers);
    getPlatforms().then(setPlatforms);
  }, []);

  if (!testSetsCollection || !testsCollection) {
    return null;
  }

  const testSets: ITestSet[] = getCollectionData(testSetsCollection);
  const tests: Test[] = getCollectionData(testsCollection);

  const testSet: ITestSet | undefined = testSets.find(
    testSet => testSet.id === id,
  );

  if (!testSet || !tests) {
    return null;
  }

  function updateTestSet(data: object) {
    const testSet = getDocById(id, testSetsCollection!.docs);
    if (testSet) {
      var testSetRef = firestore.collection('test-sets').doc(testSet.id);
      if (testSetRef) {
        testSetRef.update(data);
      }
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTestSet({
      name: e.currentTarget.value,
    });
  }

  function getTests(testSet: ITestSet) {
    return testSet.tests.map(testId => {
      const test = getDocById(testId, testsCollection!.docs);
      return {
        test: test!.data() as Test,
        status: testSet.status[testId],
      };
    });
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

  return (
    <Wrapper>
      <MaxWidth>
        <FormWrapper>
          <InputsWrapper>
            <TextField
              id="standard-required"
              label="Name"
              margin="normal"
              value={testSet.name}
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
                value={testSet.platform}
              />
              <MarginV />
              <Select
                title="Assignee"
                name="user"
                onChange={handleUserChange}
                allowNone
                data={users}
                value={testSet.user}
              />
            </SelectsWrapper>
          </InputsWrapper>
          <ActionsWrapper>
            <Button variant="text" color="primary">
              Run Remaining
            </Button>
            <MarginV margin="12px" />
            <Button variant="contained" color="primary" onClick={onRun}>
              <MarginV margin="-6px" />
              <PlayArrowIcon />
              <MarginV margin="6px" />
              Run
            </Button>
          </ActionsWrapper>
        </FormWrapper>
        <Typography variant="h6" component="p">
          Tests
        </Typography>
        <MarginH />
        {getTests(testSet).map(
          ({ test, status }: { test: Test; status: TestStatus }) => (
            <TestPreview test={test} status={status} />
          ),
        )}
      </MaxWidth>
    </Wrapper>
  );
};

export default TestSet;
