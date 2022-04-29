export enum UserState {
  Invited = "invited",
  Active = "active",
  Blocked = "blocked",
  Deleted = "deleted"
}

export type Organization = {
  id: string;
  name: string;
  logoURL?: string;
  user?: OrganizationUser
  detail?: OrganizationDetail;
}

export type OrganizationUser = {
  id: string;
  name: string;
  photoURL?: string;
  role: string;
  state: UserState;
  occupation: string
}

export type OrganizationDetail = {
  address?: string;
}

export type OrganizationState = {
  isLoading: boolean;
  error: Error | string | null;
  organizations: Record<string, Organization> | null;
  currentOrganization: Organization | null;
}

export type OrganizationFormValues = {
  id: string;
  name: string;
  legalName: string;
  logoURL?: File | any;
  afterSubmit?: string;
  ownerOccupation: string;
};
