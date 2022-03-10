import { FIREBASE_API } from '../config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);
const AUTH = getAuth(firebaseApp);
const DB = getFirestore(firebaseApp);

export { AUTH, DB }
