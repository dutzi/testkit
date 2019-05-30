import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getDisplayName, getPhotoUrl } from './selectors';
const firestore = admin.firestore();

export default functions.auth.user().onCreate(async user => {
  const globalUsers = await firestore.collection('users').get();
  const globalUserDoc = globalUsers.docs.find(
    doc => doc.data().email === user.email,
  );

  if (globalUserDoc) {
    const { workspace } = globalUserDoc.data();
    await firestore
      .collection('users')
      .doc(user.uid)
      .create({
        workspace: globalUserDoc.data().workspace,
      });

    const workspaceUsers = await firestore
      .collection(`workspaces/${workspace}/users`)
      .get();

    const workspaceUserDoc = workspaceUsers.docs.find(
      doc => doc.data().email === user.email,
    );

    if (workspaceUserDoc) {
      const workspaceUserData = await firestore
        .doc(`workspaces/${workspace}/users/${workspaceUserDoc.id}`)
        .get();

      if (workspaceUserData.data()) {
        await firestore
          .doc(`workspaces/${workspace}/users/${user.uid}`)
          .create({
            displayName: getDisplayName(user),
            photoUrl: getPhotoUrl(user),
            role: workspaceUserData.data()!.role,
            email: user.email,
            uid: user.uid,
          });

        await firestore
          .doc(`workspaces/${workspace}/users/${workspaceUserDoc.id}`)
          .delete();
      }
    }

    await firestore.doc(`users/${globalUserDoc.id}`).delete();
  }
});
