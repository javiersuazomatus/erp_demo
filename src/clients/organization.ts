import { Organization, OrganizationFormValues, OrganizationUser } from '../@types/organization';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AUTH, DB, STORAGE } from '../datasources/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import pickBy from 'lodash/pickBy';

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  const organizationRef = doc(DB, 'organizations', organizationId);
  const docSnap = await getDoc(organizationRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: data?.id,
      name: data?.name,
      logoURL: data?.logoURL,
      detail: data?.detail,
    };
  }
  return null;
}

export async function createOrganization(formValues: OrganizationFormValues) {
  console.log({ formValues });

  if (formValues.logoURL instanceof File) {
    const extension = formValues.logoURL?.name.split('.').pop();
    const avatarRef = ref(STORAGE, `organizations/${formValues.id}/logo.${extension}`);
    await uploadBytes(avatarRef, formValues.logoURL);
    formValues.logoURL = await getDownloadURL(avatarRef);
  }

  const orgsRef = doc(collection(DB, 'organizations'), formValues.id);
  await runTransaction(DB, async (transaction) => {
    const docSnap = await transaction.get(orgsRef);
    if (docSnap.exists()) {
      throw 'An organization with this name already exist';
    }

    transaction.set(orgsRef, {
      ...pickBy(formValues, attr => attr),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log({ ownerOccupation: formValues.ownerOccupation})

    const jouRef = doc(collection(DB, 'junction_organization_user'), `${formValues.id}_${AUTH.currentUser?.uid}`);
    transaction.set(jouRef, pickBy({
      organizationId: formValues.id,
      name: formValues.name,
      logoURL: formValues.logoURL,
      state: 'active',
      occupation: formValues.ownerOccupation,
      role: 'owner',
      userId: AUTH.currentUser?.uid,
      userName: AUTH.currentUser?.displayName,
      userEmail: AUTH.currentUser?.email,
      userPhotoURL: AUTH.currentUser?.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, attr => attr));

    const userRef = doc(collection(DB, 'users'), AUTH.currentUser?.uid);
    transaction.update(userRef, {
      defaultOrganizationId: formValues.id,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const q = query(
    collection(DB, 'junction_organization_user'),
    where('userId', '==', userId));
  const junctions = await getDocs(q);
  return junctions.docs
    .filter(junction => junction.exists)
    .map(doc => {
      const data = doc.data();
      return {
        id: data?.organizationId,
        name: data?.name,
        logoURL: data?.photoURL,
      };
    });
}

export async function getOrganizationUsers(organizationId: string): Promise<OrganizationUser[]> {
  const q = query(
    collection(DB, 'junction_organization_user'),
    where('organizationId', '==', organizationId));
  const junctions = await getDocs(q);
  return junctions.docs
    .filter(junction => junction.exists)
    .map(doc => {
      const data = doc.data();
      return {
        id: data?.userId,
        name:  data?.userName,
        email: data?.userEmail,
        photoURL: data?.userPhotoURL,
        state: data?.state,
        occupation: data?.occupation,
        role: data?.role,
      };
    });
}

export async function getOrganizationUser(organizationId: string, userId: string): Promise<OrganizationUser | null> {
  const jouRef = doc(collection(DB, 'junction_organization_user'), `${organizationId}_${userId}`);
  const docSnap = await getDoc(jouRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: data?.userId,
      name:  data?.userName,
      email: data?.userEmail,
      photoURL: data?.userPhotoURL,
      state: data?.state,
      occupation: data?.occupation,
      role: data?.role,
    };
  }
  return null;
}

export async function createOrganizationUser(organizationId: string, userId: string, data: Partial<OrganizationUser>) {
  const jouRef = doc(collection(DB, 'junction_organization_user'), `${organizationId}_${userId}`);
  await setDoc(jouRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrganizationUser(organizationId: string, userId: string, data: Partial<OrganizationUser>) {
  const jouRef = doc(collection(DB, 'junction_organization_user'), `${organizationId}_${userId}`);
  await updateDoc(jouRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}


