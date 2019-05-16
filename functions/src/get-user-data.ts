import * as admin from 'firebase-admin';
const firestore = admin.firestore();

export default async function(idToken: string) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);

  let userData = (await firestore
    .doc(`users/${decodedToken.uid}`)
    .get()).data();

  return userData;
}
