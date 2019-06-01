import { firestore } from '../firebase';
import { Workspace } from '../types';

export function updateWorkspace(workspace: string, data: Workspace) {
  var workspaceRef = firestore.doc(`workspaces/${workspace}`);
  workspaceRef.update(data);
}
