import {
  GlobalUserContext,
  TestsCollectionContext,
} from './../ContextProviders';
import { useContext, useState, useEffect } from 'react';
import { getDocById } from '../../clients/utils';
import { Test } from '../../types';
import _ from 'lodash';
import { updateTest } from '../../clients/test';

const updateTestBED = _.debounce(updateTest, 1000);

export function useTest(
  testId: string,
): [Test | null, (data: Partial<Test>) => void] {
  const globalUser = useContext(GlobalUserContext);
  const collection = useContext(TestsCollectionContext);
  const [testData, setTestData] = useState<Test | null>(null);

  let test: firebase.firestore.QueryDocumentSnapshot | undefined;

  if (collection) {
    test = getDocById(testId, collection.docs);
  }

  useEffect(() => {
    if (test) {
      setTestData(test.data() as Test);
    }
  }, [collection]);

  function updateTest(data: Partial<Test>) {
    updateTestBED(testId, globalUser.workspace, data, collection!);

    setTestData({
      ...testData!,
      ...data,
    });
  }

  return [testData, updateTest];
}
