import { getDocById } from './utils';
import { firestore } from '../firebase';

export function deleteTestSet(
  id: string,
  workspace: string,
  collection: firebase.firestore.QuerySnapshot,
) {
  const test = getDocById(id, collection.docs);
  if (test) {
    var testRef = firestore
      .collection(`workspaces/${workspace}/test-sets`)
      .doc(test.id);
    testRef.delete();
  }
}

export function updateTestSet(
  id: string,
  workspace: string,
  data: object,
  collection: firebase.firestore.QuerySnapshot,
) {
  const testSet = getDocById(id, collection.docs);
  if (testSet) {
    var testSetRef = firestore
      .collection(`workspaces/${workspace}/test-sets`)
      .doc(testSet.id);
    if (testSetRef) {
      testSetRef.update({ modified: new Date(), ...data });
    }
  }
}
