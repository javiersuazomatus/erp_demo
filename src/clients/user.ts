import { UserFormValues, UserProfile } from '../@types/userProfile';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  updateDoc,
  runTransaction,
  query,
  where, getDocs,
} from 'firebase/firestore';
import { AUTH, DB, STORAGE } from '../datasources/firebase';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateEmail, updateProfile } from 'firebase/auth';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(DB, 'users', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: data?.uid,
      displayName: data?.displayName,
      email: data?.email,
      photoURL: data?.logoURL,
      defaultOrganizationId: data?.defaultOrganizationId,
      createdAt: data?.createdAt.toDate(),
      updatedAt: data?.updatedAt.toDate(),
    };
  }

  return null;
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile> {
  const userRef = doc(DB, 'users', profile.uid);
  await setDoc(userRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    profile.createdAt = data?.createdAt.toDate();
    profile.updatedAt = data?.updatedAt.toDate();
  }
  return profile;
}

export async function updateUserProfile(formValues: UserFormValues) {
  if (AUTH.currentUser) {
    const userData = pickBy(formValues, attr => !isEmpty(attr));
    console.log(userData);

    if (userData.photoURL instanceof File) {
      const extension = formValues.photoURL.name.split('.').pop();
      const avatarRef = ref(STORAGE, `users/${AUTH.currentUser?.uid}/avatar.${extension}`);
      await uploadBytes(avatarRef, formValues.photoURL);
      userData.photoURL = await getDownloadURL(avatarRef);
    }

    if (userData?.displayName || userData?.photoURL) {
      await updateProfile(AUTH.currentUser, {
        displayName: userData?.displayName,
        photoURL: userData?.photoURL,
      });
    }

    if (AUTH.currentUser.email != userData?.email) {
      await updateEmail(AUTH.currentUser, userData?.email);
    }

    if (AUTH.currentUser.uid) {
      const userRef = doc(collection(DB, 'users'), AUTH.currentUser.uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });

      const q = query(
        collection(DB, 'junction_organization_user'),
        where('userId', '==', AUTH.currentUser.uid));
      const junctions = await getDocs(q);

      await Promise.all(junctions.docs.map(junction => {
        const docRef = doc(
          collection(DB, 'junction_organization_user'),
          `${junction.data().organizationId}_${AUTH.currentUser?.uid}`);
        updateDoc(docRef, pickBy({
          userName: userData?.displayName,
          userPhotoURL: userData?.photoURL,
        }, attr => attr));
      }));
    }
  }
}
