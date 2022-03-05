import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  updateEmail,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
// @types
import { ActionMap, AuthState, AuthUser, FirebaseContextType } from '../@types/auth';
//
import { FIREBASE_API } from '../config';

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

const firebaseApp = initializeApp(FIREBASE_API);
const AUTH = getAuth(firebaseApp);
const DB = getFirestore(firebaseApp);

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

enum Types {
  Initial = 'INITIALISE',
}

type FirebaseAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
};

type FirebaseActions = ActionMap<FirebaseAuthPayload>[keyof ActionMap<FirebaseAuthPayload>];

const reducer = (state: AuthState, action: FirebaseActions) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext<FirebaseContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState<DocumentData | undefined>();

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        console.log(' +++++++++++++++++ onAuthStateChanged +++++++++++++++++');
        console.log({ user });
        if (user) {
          const userRef = doc(DB, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }

          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch],
  );

  const facebookProvider = new FacebookAuthProvider();
  const googleProvider = new GoogleAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(AUTH, email, password);

  const loginWithGoogle = () => signInWithPopup(AUTH, googleProvider)
    .then(async (result) => {
      const userRef = doc(collection(DB, 'users'), result.user?.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user?.uid,
          email: result.user?.email,
          displayName: result.user?.displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });

  const loginWithFacebook = () => signInWithPopup(AUTH, facebookProvider);

  const loginWithTwitter = () => signInWithPopup(AUTH, twitterProvider);

  const register = (email: string, password: string, firstName: string, lastName: string, company: string) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const userRef = doc(collection(DB, 'users'), res.user?.uid);
        await setDoc(userRef, {
          uid: res.user?.uid,
          email,
          displayName: `${firstName} ${lastName}`,
          company,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

  const update = async (user: AuthUser) => {
    console.log(' +++++++++++++++++ update +++++++++++++++++');
    console.log({ user });
    if (AUTH.currentUser) {
      await updateProfile(AUTH.currentUser, {
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });

      if (AUTH.currentUser.email != user?.email) {
        await updateEmail(AUTH.currentUser, user?.email);
      }

      const userRef = doc(collection(DB, 'users'), state.user?.uid);
      await updateDoc(userRef, {
        ...user,
        uid: AUTH.currentUser?.uid,
        updatedAt: serverTimestamp(),
      });

      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: { ...state?.user, ...user },
        },
      });

      setProfile({ profile, ...user });
    }
  };


  const logout = () => signOut(AUTH).then(() => setProfile({}))

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          role: ADMIN_EMAILS.includes(state?.user?.email) ? 'admin' : 'user',
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
          company: profile?.company || '',
        },
        login,
        loginWithGoogle,
        loginWithFacebook,
        loginWithTwitter,
        register,
        update,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
