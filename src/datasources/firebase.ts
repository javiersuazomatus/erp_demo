import { FIREBASE_API } from '../config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);
const AUTH = getAuth(firebaseApp);
const DB = getFirestore(firebaseApp);
const STORAGE = getStorage(firebaseApp)

export { AUTH, DB, STORAGE }
