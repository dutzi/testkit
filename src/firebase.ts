import firebase from 'firebase/app';
import 'firebase/firestore'; // NEW
import 'firebase/auth';
import 'firebase/storage';

declare global {
  interface Window {
    [k: string]: any;
  }
}

const config = {
  apiKey: 'AIzaSyChaxreNcpS0dXv6BsmFVnNXI7Qr-cfYUs',
  authDomain: 'testkit-c0228.firebaseapp.com',
  databaseURL: 'https://testkit-c0228.firebaseio.com',
  projectId: 'testkit-c0228',
  storageBucket: 'testkit-c0228.appspot.com',
  messagingSenderId: '432747880734',
  appId: '1:432747880734:web:88d6236b84b80c91',
};

window.firebase = firebase;

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
// export const messaging = firebase.messaging();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signInAnonymously = () => auth.signInAnonymously();
export const signOut = () => auth.signOut();

// firestore.settings({ timestampsInSnapshots: true });

export default firebase;
