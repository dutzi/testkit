import downloadFile from './download-file';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import restrictedMiddleware from './restricted-middleware';
import parsePractitesCsv from './csv-parsers/practitest';
import addTestsBulk from './add-tests-bulk';

const app = express();

app.use(cors({ origin: true }));

app.use(restrictedMiddleware);

app.post('/', async (request: express.Request, response: express.Response) => {
  const filename = request.param('filename');
  const tempFilename = await downloadFile(filename);
  const { tests, components } = await parsePractitesCsv(tempFilename);
  await addTestsBulk(tests, request.query.idToken);
  response.send('done');
});

export default functions.https.onRequest(app);
