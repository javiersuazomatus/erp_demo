import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
} from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { ActionMap, AuthState, AuthUser, FirebaseContextType } from '../@types/auth';
import { AUTH } from '../datasources/firebase';
import { useDispatch } from '../redux/store';
import { cleanRoot } from '../redux/rootReducer';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { createUserProfile, getUserProfile, updateUserProfile } from '../clients/user';
import { UserFormValues, UserProfile } from '../@types/userProfile';

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
        if (window.sessionStorage.getItem("authenticating")) {
          window.sessionStorage.removeItem("authenticating")
        }
        console.log({ user });
        if (user) {
          const userProfile: UserProfile | null = await getUserProfile(user.uid)
          if (userProfile) {
            setProfile(userProfile);
          } else {
            const userProfile: UserProfile = await createUserProfile({
              uid: user.uid,
              displayName: user.displayName || '',
              email: user.email || '',
            })
            setProfile(userProfile);
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

  const loginWithGoogle = () => signInWithRedirect(AUTH, googleProvider);

  // TODO: implement
  const loginWithFacebook = () => signInWithRedirect(AUTH, facebookProvider);

  // TODO: implement
  const loginWithTwitter = () => signInWithRedirect(AUTH, twitterProvider);

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async (res) => {
        const userProfile = createUserProfile({
          uid: res.user?.uid,
          email,
          displayName: `${firstName} ${lastName}`,
        })
        setProfile(userProfile);
      })
      .catch(error => {
        switch (error.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            throw 'Email already in use';
          default:
            throw error.message || 'Unknown error';
        }
      });

  const update = async (formValues: UserFormValues) => {
    console.log('updateUserProfile', { formValues })
    await updateUserProfile(formValues);
    const userData = pickBy(formValues, attr => !isEmpty(attr));
    dispatch({
      type: Types.Initial,
      payload: {
        isAuthenticated: true,
        user: {
          ...state?.user,
          ...userData,
        },
      },
    });

    setProfile({
      ...profile,
      ...userData,
    });
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
          photoURL: profile?.photoURL || state?.user?.photoURL,
          displayName: profile?.displayName || state?.user?.displayName,
          role: ADMIN_EMAILS.includes(state?.user?.email) ? 'admin' : 'user',
          phoneNumber: profile?.phoneNumber || state?.user?.phoneNumber,
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
          defaultOrganizationId: profile?.defaultOrganizationId || '',
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
