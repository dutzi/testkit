import { firestore } from '../firebase';
import { User } from '../types';

export function getPlatforms() {
  return firestore
    .collection('platforms')
    .get()
    .then(res => {
      return res.docs.map(doc => doc.data() as User);
    });
}
