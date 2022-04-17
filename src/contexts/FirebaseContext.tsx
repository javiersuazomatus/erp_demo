import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, DocumentData, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ActionMap, AuthState, AuthUser, FirebaseContextType } from '../@types/auth';
import { AUTH, DB, STORAGE } from '../datasources/firebase';
import { useDispatch } from '../redux/store';
import { cleanRoot } from '../redux/rootReducer';
import { loadOrganizations } from '../redux/slices/organization';
import { FormValuesProps } from '../sections/@dashboard/user/account/AccountGeneral';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

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
  if (action.type === Types.Initial) {
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

  const reduxDispatch = useDispatch();

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        console.log('onAuthStateChanged()');
        console.log({ user });
        if (user) {
          const userRef = doc(DB, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
            const { defaultOrganizationId } = docSnap.data();
            if (defaultOrganizationId) {
              reduxDispatch(loadOrganizations(user.uid, defaultOrganizationId));
            }
          }
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: true, user },
          });
        } else {
          setProfile({});
          reduxDispatch(cleanRoot());
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
    signInWithEmailAndPassword(AUTH, email, password)
      .catch(error => {
        switch (error.code) {
          case AuthErrorCodes.INVALID_PASSWORD:
            throw 'Invalid credentials';
          default:
            throw error.message || 'Unknown error';
        }
      });

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

  // TODO: implement
  const loginWithFacebook = () => signInWithPopup(AUTH, facebookProvider);

  // TODO: implement
  const loginWithTwitter = () => signInWithPopup(AUTH, twitterProvider);

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const userRef = doc(collection(DB, 'users'), res.user?.uid);
        await setDoc(userRef, {
          uid: res.user?.uid,
          email,
          displayName: `${firstName} ${lastName}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      })
      .catch(error => {
        switch (error.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            throw 'Email already in use';
          default:
            throw error.message || 'Unknown error';
        }
      });

  const update = async (user: FormValuesProps) => {
    console.log(' +++++++++++++++++ update +++++++++++++++++');
    console.log({ user });
    const { photoFile, ...formValues } = user;
    const userData = pickBy(formValues, attr => !isEmpty(attr));
    console.log(userData);

    if (AUTH.currentUser) {
      let photoURL;

      if (photoFile instanceof File) {
        const extension = photoFile.name.split('.').pop();
        const avatarRef = ref(STORAGE, `users/${AUTH.currentUser?.uid}/avatar.${extension}`);
        await uploadBytes(avatarRef, photoFile);
        photoURL = await getDownloadURL(avatarRef);
      } else {
        photoURL = AUTH.currentUser.photoURL;
      }

      await updateProfile(AUTH.currentUser, {
        displayName: user?.displayName || AUTH.currentUser.displayName,
        photoURL: photoURL,
      });

      if (AUTH.currentUser.email != user?.email) {
        await updateEmail(AUTH.currentUser, user?.email);
      }

      const userRef = doc(collection(DB, 'users'), state.user?.uid);
      await updateDoc(userRef, {
        ...userData,
        photoURL,
        uid: AUTH.currentUser?.uid,
        updatedAt: serverTimestamp(),
      });

      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: { ...state?.user, ...userData, photoURL },
        },
      });

      setProfile({ profile, ...userData, photoURL });
    }
  };


  const logout = () => signOut(AUTH);

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
          organization: profile?.organization || '',
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
