import * as admin from 'firebase-admin';
import getUserData from './get-user-data';

const firestore = admin.firestore();

export default async function(tests: any[], idToken: string) {
  const userData = await getUserData(idToken);
  if (userData) {
    const collection = firestore.collection(
      `workspaces/${userData.workspace}/tests`,
    );

    tests.forEach(async test => {
      try {
        await collection.doc(test.id).create(test);
      } catch (err) {
        console.log(err, test);
      }
    });
  }
}
