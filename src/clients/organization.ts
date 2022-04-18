import { Organization, OrganizationFormValues, OrganizationUser } from '../@types/organization';
import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { DB, STORAGE } from '../datasources/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  const organizationRef = doc(DB, 'organizations', organizationId);
  const docSnap = await getDoc(organizationRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: data?.id,
      name: data?.name,
      logoURL: data?.logoURL,
    };
  }
  return null;
}

export async function createOrganization(formValues: OrganizationFormValues, ownerId: string) {
  console.log({ formValues })
  const {logo, ...organization} = formValues;

  let logoURL: string | null = null;

  if (logo instanceof File) {
    const extension = logo.name.split('.').pop();
    const avatarRef = ref(STORAGE, `organizations/${organization.id}/logo.${extension}`);
    await uploadBytes(avatarRef, logo);
    logoURL = await getDownloadURL(avatarRef);
  }

  const compsRef = doc(collection(DB, 'organizations'), organization.id);
  await runTransaction(DB, async (transaction) => {
    const docSnap = await transaction.get(compsRef);
    if (docSnap.exists()) {
      throw 'An organization with this name already exist';
    }

    transaction.set(compsRef, {
      ...organization,
      logoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const { id, name } = organization;
    const jucRef = doc(collection(DB, 'junction_organization_user'), `${organization.id}_${ownerId}`);
    transaction.set(jucRef, {
      organizationId: id,
      userId: ownerId,
      name,
      logoURL,
      estate: 'active',
      occupation: 'owner',
      rol: 'owner',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const userRef = doc(collection(DB, 'users'), ownerId);
    transaction.update(userRef, {
      defaultOrganizationId: organization.id,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function getOrganizationUsers(userId: string): Promise<OrganizationUser[]> {
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
        estate: data?.estate,
        occupation: data?.occupation,
        logoURL: data?.photoURL,
        role: data?.role,
      };
    });
}

