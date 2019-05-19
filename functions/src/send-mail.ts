import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';

const sendgridApiKey = functions.config().sendgrid.apikey;

sgMail.setApiKey(sendgridApiKey);

interface Message {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export default function(message: Message) {
  return sgMail.send(message);
}
