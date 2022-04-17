import { createSlice } from '@reduxjs/toolkit';
import { Company, UserCompany, CompanyState } from '../../@types/company';
import { dispatch } from '../store';
import { getUserCompanies, getCompany } from '../../clients/company'

const initialState: CompanyState = {
  isLoading: false,
  error: null,
  companies: [],
  defaultCompany: null,
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
      state.defaultCompany = action.payload.defaultCompany;
      state.company = action.payload.company;
      state.isLoading = false;
    },

    // GET COMPANY
    loadCompanySuccess(state, action) {
      console.log('loadCompanySuccess');
      state.company = action.payload;
      state.isLoading = false;
    },

    // CREATE COMPANY
    createCompanySuccess(state, action) {
      console.log('createCompanySuccess');
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export function loadCompanies(userId: string, defaultCompanyId: string | null) {
  return async () => {
    console.log('loadCompanies', {userId, defaultCompanyId});
    dispatch(slice.actions.startLoading());
    try {
      const companies: UserCompany[] = await getUserCompanies(userId);
      const defaultCompany: UserCompany | undefined = companies
        .find(company => defaultCompanyId == company.id);

      console.log({ defaultCompany });
      const company: Company | null = defaultCompany
        ? await getCompany(defaultCompany.id)
        : null;

      console.log({ companies, defaultCompany, company });
      dispatch(slice.actions.loadCompaniesSuccess({ companies, defaultCompany, company }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
