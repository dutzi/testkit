import * as admin from 'firebase-admin';
import getUserData from './get-user-data';

const firestore = admin.firestore();

export default async function(tests: any[], idToken: string) {
  const userData = await getUserData(idToken);
  let numSuccess = 0;
  let numFailed = 0;
  let failedIds: string[] = [];

  if (userData) {
    const collection = firestore.collection(
      `workspaces/${userData.workspace}/tests`,
    );
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      try {
        await collection.doc(test.id).create(test);
        numSuccess++;
      } catch (err) {
        if (!err.details.startsWith('Document already exists')) {
          console.error('[add-tests-buld]', err, test);
        }
        numFailed++;
        failedIds.push(test.id);
      }
    }
  }

  console.log({ numSuccess, numFailed, failedIds });

  return {
    numSuccess,
    numFailed,
    failedIds,
  };
}
