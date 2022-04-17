import { createSlice } from '@reduxjs/toolkit';
import { Organization, OrganizationState, OrganizationUser } from '../../@types/organization';
import { dispatch } from '../store';
import { getOrganization, getOrganizationUsers } from '../../clients/organization';

const initialState: OrganizationState = {
  isLoading: false,
  error: null,
  organizations: [],
  defaultOrganization: null,
  organization: null,
};

const slice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      console.log(action.payload);
      state.error = action.payload;
      state.isLoading = false;
    },

    loadOrganizationsSuccess(state, action) {
      console.log('loadOrganizationsSuccess');
      console.log({ action });
      state.organizations = action.payload.organizations;
      state.defaultOrganization = action.payload.defaultOrganization;
      state.organization = action.payload.organization;
      state.isLoading = false;
    },
  },
});

export default slice.reducer;

export function loadOrganizations(userId: string, defaultOrganizationId: string | null) {
  return async () => {
    console.log('loadOrganizations', {userId, defaultOrganizationId});
    dispatch(slice.actions.startLoading());
    try {
      const organizations: OrganizationUser[] = await getOrganizationUsers(userId);
      const defaultOrganization: OrganizationUser | null = organizations
        .find(organization => defaultOrganizationId == organization.id) || null;

      console.log({ defaultOrganization });
      const organization: Organization | null = defaultOrganization
        ? await getOrganization(defaultOrganization.id)
        : null;

      console.log({ organizations, defaultOrganization, organization });
      dispatch(slice.actions.loadOrganizationsSuccess({ organizations, defaultOrganization, organization }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
