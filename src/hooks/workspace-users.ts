import { GlobalUserContext } from './../views/ContextProviders';
import { firestore } from '../firebase';
import { WorkspaceUser } from '../types';
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import { useContext } from 'react';

export function useWorkspaceUsers() {
  const globalUser = useContext(GlobalUserContext);

  const usersCollectionRef = firestore.collection(
    `workspaces/${globalUser.workspace}/users`,
  );

  const { value: usersCollection } = useCollection(usersCollectionRef);
  const { value: users } = useCollectionData<WorkspaceUser>(usersCollectionRef);

  function updateUser(uid: string, data: Partial<WorkspaceUser>) {
    if (users && usersCollection) {
      const doc = usersCollection.docs.find(doc => doc.data().uid === uid);
      if (doc) {
        usersCollectionRef.doc(doc.id).update(data);
      }
    }
  }

  return [users, updateUser] as [typeof users, typeof updateUser];
}
