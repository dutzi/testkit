// const functions = require('firebase-functions');
import * as admin from 'firebase-admin';
// admin.initializeApp();
// const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
// const fs = require('fs');

// admin.initializeApp(functions.config().firebase);

export default async (filePath: string, fileBucket?: string) => {
  const filename = 'tmpfile.csv';
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), filename);
  // const metadata = {
  //   contentType: contentType,
  // };
  await bucket.file(filePath).download({ destination: tempFilePath });
  // Generate a thumbnail using ImageMagick.
  // await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  // const thumbFileName = `thumb_${fileName}`;
  // const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
  // Uploading the thumbnail.
  // await bucket.upload(tempFilePath, {
  //   destination: thumbFilePath,
  //   metadata: metadata,
  // });
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  // return fs.unlinkSync(tempFilePath);
  return tempFilePath;
};
