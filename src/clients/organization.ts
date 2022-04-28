import { OrganizationUser, Organization, OrganizationFormValues, UserEstate } from '../@types/organization';
import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { DB, AUTH, STORAGE } from '../datasources/firebase';
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

export async function createOrganization(formValues: OrganizationFormValues, ownerId: string) {
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

    const jouRef = doc(collection(DB, 'junction_organization_user'), `${formValues.id}_${ownerId}`);
    transaction.set(jouRef, pickBy({
      organizationId: formValues.id,
      name: formValues.name,
      logoURL: formValues.logoURL,
      estate: 'active',
      occupation: formValues.ownerOccupation,
      role: 'owner',
      userId: ownerId,
      useName: AUTH.currentUser?.displayName,
      userPhotoURL: AUTH.currentUser?.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, attr => attr));

    const userRef = doc(collection(DB, 'users'), ownerId);
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
        user: {
          id: data?.id,
          name: data?.name,
          estate: data?.estate,
          occupation: data?.occupation,
          role: data?.role,
        },
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
        photoURL: data?.userPhotoURL,
        estate: data?.estate,
        occupation: data?.occupation,
        role: data?.role,
      };
    });
}

