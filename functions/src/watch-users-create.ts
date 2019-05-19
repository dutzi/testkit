import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
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

    const users = await firestore
      .collection(`workspaces/${workspace}/users`)
      .get();

    const userDoc = users.docs.find(doc => doc.data().email === user.email);
    if (userDoc) {
      await firestore
        .doc(`workspaces/${workspace}/users/${userDoc.id}`)
        .update({
          uid: user.uid,
        });
    }
  }
});
