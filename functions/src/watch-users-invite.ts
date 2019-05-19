import * as functions from 'firebase-functions';
import sendMail from './send-mail';
import * as inviteMessage from './mails/invite';

export default functions.firestore
  .document('users/{tempUserId}')
  .onCreate(async snapshot => {
    const data = snapshot.data();
    if (data) {
      if (data.isTemporaryUser) {
        console.log('user created!', data);
        await sendMail({
          to: data.email,
          from: 'invite@testkit.dev',
          ...inviteMessage,
        });
      }
    }
  });
