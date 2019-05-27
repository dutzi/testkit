import { firestore } from '../firebase';
import { WorkspaceUser } from '../types';

export function getWorkspaceUsers(workspace) {
  return firestore
    .collection(`workspaces/${workspace}/users`)
    .get()
    .then(res => {
      return res.docs.map(doc => doc.data() as WorkspaceUser);
    });
}
