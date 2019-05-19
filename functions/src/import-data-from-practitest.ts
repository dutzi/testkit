import downloadFile from './download-file';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import restrictedMiddleware from './restricted-middleware';
import parsePractitesCsv from './csv-parsers/practitest';
import addTestsBulk from './add-tests-bulk';
import addComponentsBulk from './add-components-bulk';
import * as fs from 'fs';

const app = express();

app.use(cors({ origin: true }));

app.use(restrictedMiddleware);

app.post('/', async (request: express.Request, response: express.Response) => {
  const filename = request.param('filename');
  const tempFilename = await downloadFile(filename);
  const { tests, components } = await parsePractitesCsv(tempFilename);

  const importTestsSummary = await addTestsBulk(tests, request.query.idToken);
  const importComponentsSummary = await addComponentsBulk(
    components,
    request.query.idToken,
  );

  fs.unlinkSync(tempFilename);

  response.send({
    status: 'ok',
    tests: {
      ...importTestsSummary,
    },
    components: {
      ...importComponentsSummary,
    },
  });
});

export default functions.https.onRequest(app);
