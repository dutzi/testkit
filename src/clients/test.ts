import { firestore } from '../firebase';
import { getDocById } from './utils';

export function updateTest(
  id: string,
  workspace: string,
  data: object,
  collection: firebase.firestore.QuerySnapshot,
  updateModified: boolean = true,
) {
  const test = getDocById(id, collection.docs);
  if (test) {
    var testRef = firestore
      .collection(`workspaces/${workspace}/tests`)
      .doc(test.id);

    const newData: any = {
      ...data,
    };

    if (updateModified) {
      newData.modified = new Date();
    }

    testRef.update(newData);
  }
}

export function deleteTest(
  id: string,
  workspace: string,
  collection: firebase.firestore.QuerySnapshot,
) {
  const test = getDocById(id, collection.docs);
  if (test) {
    var testRef = firestore
      .collection(`workspaces/${workspace}/tests`)
      .doc(test.id);
    testRef.delete();
  }
}
