import React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { getCollectionData, getDocById } from '../utils';
import { TestSet as ITestSet, Test, TestStatus } from '../types';
import TestPreview from '../components/TestPreview';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
  padding: 24px;
  max-width: 1024px;
`;

const Margin = styled.div`
  margin-bottom: 12px;
`;

const TestSet = ({ id }: { id: string }) => {
  const { value: testSetsCollection } = useCollection(
    firestore.collection('test-sets'),
  );

  const { value: testsCollection } = useCollection(
    firestore.collection('tests'),
  );

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

  getTests(testSet);

  return (
    <Wrapper>
      <TextField
        id="standard-required"
        label="Name"
        margin="normal"
        value={testSet.name}
        onChange={handleNameChange}
        fullWidth
        autoFocus
      />
      <Margin />
      <Typography variant="subtitle1" component="p">
        Tests
      </Typography>
      <Margin />
      {getTests(testSet).map(
        ({ test, status }: { test: Test; status: TestStatus }) => (
          <TestPreview test={test} status={status} />
        ),
      )}
    </Wrapper>
  );
};

export default TestSet;
