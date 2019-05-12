import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const createWorkspace = functions.https.onRequest(
  async (request, response) => {
    const name = request.param('name').trim();
    const id = name;

    if (
      (await firestore
        .collection('workspaces')
        .doc(id)
        .get()).exists
    ) {
      response.json({
        status: 'error',
        error: 'NameIsTaken',
      });
    } else {
      await firestore
        .collection('workspaces')
        .doc(id)
        .create({
          name,
        });

      const collectionDoc = firestore
        .collection('workspaces')
        .doc(id)
        .collection('components')
        .doc();

      await collectionDoc.create({
        label: 'My First Component',
        name: 'my-first-component',
      });

      await collectionDoc
        .collection('areas')
        .doc()
        .create({
          label: 'My First Area',
          name: 'my-first-area',
        });

      const platformsCollection = firestore
        .collection('workspaces')
        .doc(id)
        .collection('platforms');

      await platformsCollection
        .doc()
        .create({ id: '1', name: 'iPhone (Safari)' });

      await platformsCollection
        .doc()
        .create({ id: '1', name: 'Android (Chrome)' });

      await firestore
        .collection('workspaces')
        .doc(id)
        .collection('tests')
        .doc()
        .create({
          area: 'my-first-area',
          component: 'my-first-component',
          id: '1',
          lastRun: null,
          modified: null,
          name: 'My first test',
          state: 'ready',
          status: 'passed',
          steps: [],
        });

      // const user = await admin.auth().verifyIdToken;
      // await firestore
      //   .collection('workspaces')
      //   .doc(id)
      //   .collection('users')
      //   .doc()
      //   .create({
      //     email: user.email,
      //     id: '1',
      //     name: user.displayName,
      //   });

      response.json({
        status: 'ok',
      });
    }
    response.json({
      wtf: 'wtf',
    });
  },
);
