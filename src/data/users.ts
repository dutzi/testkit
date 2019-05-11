import { firestore } from '../firebase';
import { User } from '../types';

export function getUsers() {
  return firestore
    .collection('users')
    .get()
    .then(res => {
      return res.docs.map(doc => doc.data() as User);
    });
}
