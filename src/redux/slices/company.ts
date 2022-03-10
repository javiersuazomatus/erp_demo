import { createSlice } from '@reduxjs/toolkit';
// firebase
import {DB} from '../../datasources/firebase'
import {
  collection,
  getDocs,
  getDoc,
} from 'firebase/firestore';

// @types
import { Company, CompanyState } from '../../@types/company';
//
import { dispatch } from '../store';


const initialState: CompanyState = {
  isLoading: false,
  error: null,
  companies: [],
  company: null,
}

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
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET COMPANIES
    getCompaniesSuccess(state, action) {
      console.log({ action })
      state.isLoading = false;
      state.companies = action.payload;
    },

    // GET COMPANY
    getCompanySuccess(state, action) {
      state.isLoading = false;
      state.company = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCompanies() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const querySnapshot = await getDocs(collection(DB, "companies"));
      const companiesFromDB: Company[] = querySnapshot.docs.map(doc =>  {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          photoURL: data.photoURL
        }
      });
      console.log({companiesFromDB});
      dispatch(slice.actions.getCompaniesSuccess(companiesFromDB));
    } catch (error) {
      console.log(error)
      dispatch(slice.actions.hasError(error));
    }
  };
}
