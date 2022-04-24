import { createSlice } from '@reduxjs/toolkit';
import { Organization, OrganizationState } from '../../@types/organization';
import { store, dispatch } from '../store';
import { getOrganization, getOrganizationUsers } from '../../clients/organization';

const initialState: OrganizationState = {
  isLoading: false,
  error: null,
  organizations: null,
  currentOrganization: null
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
      state.organizations = action.payload;
      state.isLoading = false;
    },

    loadCurrentOrganizationSuccess(state, action) {
      console.log('loadCurrentOrganizationSuccess');
      state.currentOrganization = action.payload;
      state.isLoading = false;
    },
  },
});

export default slice.reducer;

export function loadUserOrganizations(userId: string) {
  return async () => {
    console.log('loadOrganizations', { userId });
    dispatch(slice.actions.startLoading());
    try {
      const organizationsList: Organization[] = await getOrganizationUsers(userId);

      const organizations = organizationsList
        .reduce(function(map: Record<string, Organization>, obj: Organization) {
          map[obj.id] = obj;
          return map;
        }, {});

      dispatch(slice.actions.loadOrganizationsSuccess(organizations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function loadCurrentOrganization(currentOrganizationId: string) {
  return async () => {
    console.log('loadCurrentOrganization', { currentOrganizationId });
    dispatch(slice.actions.startLoading());
    try {
      const organizations: Record<string, Organization> = store.getState().organization.organizations;

      if (organizations[currentOrganizationId]) {
        const currentOrganization: Organization | null =  await getOrganization(currentOrganizationId);
        dispatch(slice.actions.loadCurrentOrganizationSuccess({
          ...organizations[currentOrganizationId],
          ...currentOrganization
        }));
      } else {
        dispatch(slice.actions.loadCurrentOrganizationSuccess(null));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


