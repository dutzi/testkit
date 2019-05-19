import * as admin from 'firebase-admin';
import getUserData from './get-user-data';

const firestore = admin.firestore();

export default async function(components: any, idToken: string) {
  const userData = await getUserData(idToken);
  let numSuccess = 0;
  let numFailed = 0;
  let failedIds: string[] = [];

  if (userData) {
    const workspaceDocRef = firestore.doc(`workspaces/${userData.workspace}`);

    const workspaceDocData = (await workspaceDocRef.get()).data();

    if (!workspaceDocData) {
      return {};
    }

    if (!workspaceDocData.components) {
      workspaceDocData.components = {};
    }

    const keys = Object.keys(components);
    for (let i = 0; i < keys.length; i++) {
      if (workspaceDocData.components[keys[i]]) {
        numFailed++;
        failedIds.push(keys[i]);
      } else {
        numSuccess++;
      }
    }

    await workspaceDocRef.update({
      ...workspaceDocData,
      components: {
        ...components,
        ...workspaceDocData.components,
      },
    });
  }

  console.log('[add-components-bulk]', { numSuccess, numFailed, failedIds });

  return {
    numSuccess,
    numFailed,
    failedIds,
  };
}
