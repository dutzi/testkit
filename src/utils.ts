import { Test } from './types';
import { firestore } from './firebase';

export function getTestById(
  id: any,
  tests: firebase.firestore.QueryDocumentSnapshot[],
) {
  return tests.find(test => test.data().id === parseInt(id));
}

export function updateTest(
  id: string,
  data: object,
  collection: firebase.firestore.QuerySnapshot,
) {
  const test = getTestById(id, collection!.docs);
  if (test) {
    var testRef = firestore.collection('tests').doc(test.id);
    testRef.update(data);
  }
}
