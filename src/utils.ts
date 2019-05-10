import { Test } from './types';
import { firestore } from './firebase';

export function getTestById(
  id: any,
  tests: firebase.firestore.QueryDocumentSnapshot[],
) {
  return tests.find(test => test.data().id === id);
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

export function deleteTest(
  id: string,
  collection: firebase.firestore.QuerySnapshot,
) {
  const test = getTestById(id, collection.docs);
  if (test) {
    var testRef = firestore.collection('tests').doc(test.id);
    testRef.delete();
  }
}

export function getCollectionData(collection): Test[] {
  if (collection) {
    return collection.docs.map(doc => doc.data());
  } else {
    return [];
  }
}
