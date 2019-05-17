import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
const cors = require('cors');
const uuidv1 = require('uuid/v1');

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
function restrictedMiddleware(req: any, res: any, next: any) {
  if (req.query.idToken) {
    return next();
  } else {
    const err = new Error('Not authorized');
    return next(err);
  }
}

app.use(restrictedMiddleware);

// build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
app.post('/', async (request: express.Request, response: express.Response) => {
  const name = request.param('name').trim();
  const email = request.param('email');

  const id = name.toLocaleLowerCase();
  let uid;

  try {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(request.query.idToken);
    uid = decodedToken.uid;
  } catch (err) {
    response.status(401).send({
      status: 'unauthorized',
    });
    return;
  }

  if (
    (await firestore
      .collection('workspaces')
      .doc(id)
      .get()).exists
  ) {
    response.status(409).send({
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
        steps: [
          {
            id: uuidv1(),
            description: '',
            result: '',
          },
        ],
      });

    await firestore
      .collection('workspaces')
      .doc(id)
      .collection('users')
      .doc()
      .create({
        role: 'admin',
        email,
        id: uid,
      });

    await firestore
      .collection('users')
      .doc(uid)
      .create({
        workspace: id,
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

    response.status(200).send({
      status: 'ok',
    });
  }

  // res.send({
  //   params: req.query,
  //   wtf: '11221',
  // }),
});
// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));

// Expose Express API as a single Cloud Function:
export default functions.https.onRequest(app);
