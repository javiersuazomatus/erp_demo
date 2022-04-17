import { Company, UserCompany } from '../@types/company';
import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { DB } from '../datasources/firebase';

export async function getCompany(companyId: string): Promise<Company | null> {
  const companyRef = doc(DB, 'companies', companyId);
  const docSnap = await getDoc(companyRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: data?.id,
      name: data?.name,
      photoURL: data?.photoURL,
    };
  }
  return null;
}

export async function createCompany(company: Company, ownerId: string) {
  const compsRef = doc(collection(DB, 'companies'), company.id);
  await runTransaction(DB, async (transaction) => {
    const docSnap = await transaction.get(compsRef);
    if (docSnap.exists()) {
      throw 'An company with this name already exist';
    }

    transaction.set(compsRef, {
      ...company,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const { id, name, photoURL } = company;
    const jucRef = doc(collection(DB, 'junction_user_company'), `${ownerId}_${company.id}`);
    transaction.set(jucRef, {
      companyId: id,
      userId: ownerId,
      name,
      photoURL,
      estate: 'active',
      occupation: 'owner',
      rol: 'owner',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const userRef = doc(collection(DB, 'users'), ownerId);
    transaction.update(userRef, {
      defaultCompanyId: company.id,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function getUserCompanies(userId: string): Promise<UserCompany[]> {
  const q = query(
    collection(DB, 'junction_user_company'),
    where('userId', '==', userId));
  const junctions = await getDocs(q);
  return junctions.docs
    .filter(junction => junction.exists)
    .map(doc => {
      const data = doc.data();
      return {
        id: data?.companyId,
        name: data?.name,
        estate: data?.estate,
        occupation: data?.occupation,
        photoURL: data?.photoURL,
        role: data?.role,
      };
    });
}

export async function patchUserCompany(userId: string, companyId: string, data: object) {
  const jucRef = doc(collection(DB, 'junction_user_company'), `${userId}_${companyId}`);
  await runTransaction(DB, async (transaction) => {
    const docSnap = await transaction.get(jucRef);
    if (!docSnap.exists()) {
      throw 'User company does not exist!';
    }
    transaction.update(jucRef, data);
  });
}
