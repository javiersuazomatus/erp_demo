import { createSlice } from '@reduxjs/toolkit';
// firebase
import { DB } from '../../datasources/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// @types
import { Company, CompanyState } from '../../@types/company';
//
import { dispatch, store } from '../store';


const initialState: CompanyState = {
  isLoading: false,
  error: null,
  companies: [],
  company: null,
};

const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      console.log(action.payload);
      state.error = action.payload;
      state.isLoading = false;
    },

    // GET COMPANIES
    loadCompaniesSuccess(state, action) {
      console.log('loadCompaniesSuccess');
      console.log({ action });
      state.companies = action.payload.companies;
      state.company = action.payload.company;
      state.isLoading = false;
    },

    // GET COMPANY
    loadCompanySuccess(state, action) {
      console.log('loadCompanySuccess');
      state.company = action.payload;
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function loadCompanies(userId: string) {
  return async () => {
    console.log('loadCompanies');
    dispatch(slice.actions.startLoading());
    try {
      const companies: Company[] | null = await getCompanies(userId);
      console.log({ companies });

      const defaultCompany: Company | undefined = companies.find(company => company.default);

      const companyDetail: Company | null = defaultCompany
        ? await getCompany(defaultCompany.id)
        : null;

      dispatch(slice.actions.loadCompaniesSuccess({
        companies,
        company: { ...defaultCompany, ...companyDetail },
      }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function loadDefaultCompany() {
  console.log('loadDefaultCompany');
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const defaultCompany: Company = store.getState().company.companies
        .find((company: Company) => company.default);
      if (defaultCompany) {
        const companyDetail = await getCompany(defaultCompany.id);
        dispatch(slice.actions.loadCompanySuccess({ ...defaultCompany, ...companyDetail }));
      } else {
        dispatch(slice.actions.loadCompanySuccess(null));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

async function getCompanies(userId: string): Promise<Company[] | []> {
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
        default: data?.default,
        name: data?.name,
        occupation: data?.occupatio,
        photoURL: data?.photoURL,
        role: data?.role,
      };
    });
}

async function getCompany(companyId: string): Promise<Company | null> {
  const companyRef = doc(DB, 'companies', companyId);
  const docSnap = await getDoc(companyRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: data?.id,
      default: data?.default,
      name: data?.name,
      occupation: data?.occupatio,
      photoURL: data?.photoURL,
      role: data?.role,
    };
  }
  return null;
}

async function newCompany(company: Company) {

}
