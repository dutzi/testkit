import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { useCollection } from 'react-firebase-hooks/firestore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { firestore } from '../firebase';
import { getCollectionData, getDocById } from '../utils';
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

const Wrapper = styled.div`
  padding: 24px;
  overflow: auto;
`;

const MaxWidth = styled.div`
  max-width: 1024px;
`;

const MarginH = styled.div`
  margin-bottom: 12px;
`;

const MarginV = styled.div`
  margin-right: ${(p: { margin?: string }) => p.margin || '24px'};
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

const TestSet = ({ id }: { id: string }) => {
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
              <FormControl fullWidth>
                <InputLabel htmlFor="platform">Platform</InputLabel>
                <Select
                  value={testSet.platform}
                  onChange={handlePlatformChange}
                  inputProps={{
                    name: 'platform',
                    id: 'platform',
                  }}
                >
                  <MenuItem key="-1" value="-1">
                    None
                  </MenuItem>
                  {platforms.map(platform => (
                    <MenuItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MarginV />
              <FormControl fullWidth>
                <InputLabel htmlFor="user">User</InputLabel>
                <Select
                  value={testSet.user}
                  onChange={handleUserChange}
                  inputProps={{
                    name: 'user',
                    id: 'user',
                  }}
                >
                  <MenuItem key="-1" value="-1">
                    None
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectsWrapper>
          </InputsWrapper>
          <ActionsWrapper>
            <Button variant="text" color="primary">
              Run Remaining
            </Button>
            <MarginV margin="12px" />
            <Button variant="contained" color="primary">
              <MarginV margin="-6px" />
              <PlayArrowIcon />
              <MarginV margin="6px" />
              Run
            </Button>
          </ActionsWrapper>
        </FormWrapper>
        <Typography variant="subtitle1" component="p">
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
