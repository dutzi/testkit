import { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import { firestore } from '../../firebase';
import { getDocById, getCollectionData, getNextId } from '../../clients/utils';
import { TestSet as ITestSet, Test, TestStatus } from '../../types';
import { createTestSet } from '../../model/test-set';
import {
  GlobalUserContext,
  TestsCollectionContext,
  TestSetsCollectionContext,
} from '../ContextProviders';
import { updateTestSet } from '../../clients/test-set';

const debouncedUpdateTestSet = _.debounce(updateTestSet, 1000);

export function useTestSet(
  id: string,
): [
  ITestSet | undefined,
  (data: Partial<ITestSet>) => void,
  () => Promise<number>,
  boolean,
  { test: Test; status: TestStatus }[]
] {
  const globalUser = useContext(GlobalUserContext);
  const [createdTestSet, setCreatedTestSet] = useState<ITestSet>(
    createTestSet(),
  );
  const [testSet, setTestSet] = useState<ITestSet | undefined>();
  const testsCollection = useContext(TestsCollectionContext);
  const testSetsCollection = useContext(TestSetsCollectionContext);

  const isCreating = id === 'create';

  useEffect(() => {
    if (isCreating) {
      var searchParams = new URLSearchParams(window.location.search);
      setCreatedTestSet({
        ...createdTestSet,
        tests: (searchParams.get('tests') || '').split(','),
      });
    }
  }, []);

  useEffect(() => {
    const testSets: ITestSet[] = getCollectionData(testSetsCollection);

    setTestSet(testSets.find(testSet => testSet.id === id));
  }, [testSetsCollection, id]);

  function updateTestSet(data: Partial<ITestSet>) {
    if (isCreating) {
      setCreatedTestSet({
        ...createdTestSet,
        ...(data as ITestSet),
      });
    } else {
      setTestSet({ ...testSet, ...(data as ITestSet) });
      debouncedUpdateTestSet(
        id,
        globalUser.workspace,
        data,
        testSetsCollection,
      );
    }
  }

  function onSave() {
    return new Promise<number>(resolve => {
      if (testSetsCollection) {
        const nextId = getNextId(testSetsCollection);

        firestore
          .collection(`workspaces/${globalUser.workspace}/test-sets`)
          .add({
            ...createdTestSet,
            id: String(nextId),
          })
          .then(() => resolve(nextId));
      }
    });
  }

  function getTests(testSet: ITestSet | undefined) {
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

  if (isCreating) {
    return [
      createdTestSet,
      updateTestSet,
      onSave,
      isCreating,
      getTests(createdTestSet),
    ];
  } else {
    return [testSet, updateTestSet, onSave, isCreating, getTests(testSet)];
  }
}
