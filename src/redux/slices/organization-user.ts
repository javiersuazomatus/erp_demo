import { createSlice } from '@reduxjs/toolkit';
import { Organization, OrganizationUser, OrganizationUserState } from '../../@types/organization';
import { dispatch, store } from '../store';
import { getOrganizationUser, getOrganizationUsers } from '../../clients/organization';
import isEmpty from 'lodash/isEmpty';

const initialState: OrganizationUserState = {
  isLoading: false,
  error: null,
  users: [],
  currentUser: null,
};

const slice = createSlice({
  name: 'organizationUser',
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

    loadUsersSuccess(state, action) {
      console.log('loadUsersSuccess');
      state.users = action.payload;
      state.isLoading = false;
    },

    loadCurrentUserSuccess(state, action) {
      console.log('setCurrentUserSuccess');
      state.currentUser = action.payload;
      state.isLoading = false;
    },
  },
});

export default slice.reducer;

export function loadOrgUsers(organizationId: string) {
  return async () => {
    console.log('loadOrgUsers', organizationId);
    dispatch(slice.actions.startLoading());
    try {
      const users = await getOrganizationUsers(organizationId);
      dispatch(slice.actions.loadUsersSuccess(users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function refreshOrgUsers(users: OrganizationUser[]) {
  return async () => dispatch(slice.actions.loadUsersSuccess(users));
}

export function loadCurrentUser(userId: string) {
  return async () => {
    console.log('loadCurrentUser', userId);
    dispatch(slice.actions.startLoading());
    try {
      const users: OrganizationUser[] = store.getState().organizationUser.users;
      if (!isEmpty(users)) {
        const user = users.find(user => user.id == userId);
        if (user) {
          dispatch(slice.actions.loadCurrentUserSuccess(user));
          return;
        }
      }
      const currentOrganization: Organization = store.getState().organization.currentOrganization;
      if (!currentOrganization) {
        dispatch(slice.actions.loadCurrentUserSuccess(null));
      } else {
        const user = await getOrganizationUser(currentOrganization.id, userId);
        dispatch(slice.actions.loadCurrentUserSuccess(user));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


