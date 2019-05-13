import createWorkspace from './create-workspace';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as express from 'express';
// // const cors = require('cors')({ origin: true });
// const cors = require('cors')();

// const app = express();

// admin.initializeApp(functions.config().firebase);

// const firestore = admin.firestore();
// firestore.settings({ timestampsInSnapshots: true });

// // // Start writing Firebase Functions
// // // https://firebase.google.com/docs/functions/typescript
// //
// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });

// export const createWorkspace = async (
//   request: express.Request,
//   response: express.Response,
// ) => {
//   const name = request.param('name').trim();
//   const id = name;

//   if (
//     (await firestore
//       .collection('workspaces')
//       .doc(id)
//       .get()).exists
//   ) {
//     response.status(409).send({
//       status: 'error',
//       error: 'NameIsTaken',
//     });
//   } else {
//     await firestore
//       .collection('workspaces')
//       .doc(id)
//       .create({
//         name,
//       });

//     const collectionDoc = firestore
//       .collection('workspaces')
//       .doc(id)
//       .collection('components')
//       .doc();

//     await collectionDoc.create({
//       label: 'My First Component',
//       name: 'my-first-component',
//     });

//     await collectionDoc
//       .collection('areas')
//       .doc()
//       .create({
//         label: 'My First Area',
//         name: 'my-first-area',
//       });

//     const platformsCollection = firestore
//       .collection('workspaces')
//       .doc(id)
//       .collection('platforms');

//     await platformsCollection
//       .doc()
//       .create({ id: '1', name: 'iPhone (Safari)' });

//     await platformsCollection
//       .doc()
//       .create({ id: '1', name: 'Android (Chrome)' });

//     await firestore
//       .collection('workspaces')
//       .doc(id)
//       .collection('tests')
//       .doc()
//       .create({
//         area: 'my-first-area',
//         component: 'my-first-component',
//         id: '1',
//         lastRun: null,
//         modified: null,
//         name: 'My first test',
//         state: 'ready',
//         status: 'passed',
//         steps: [],
//       });

//     // const user = await admin.auth().verifyIdToken;
//     // await firestore
//     //   .collection('workspaces')
//     //   .doc(id)
//     //   .collection('users')
//     //   .doc()
//     //   .create({
//     //     email: user.email,
//     //     id: '1',
//     //     name: user.displayName,
//     //   });

//     response.status(200).send({
//       status: 'ok',
//     });
//   }
// };

// app.use(createWorkspace);
// app.use(cors);

// exports.app = functions.https.onRequest(app);
exports.createWorkspace = createWorkspace;
