export enum UserState {
  Invited = "invited",
  Active = "active",
  Blocked = "blocked",
  Deleted = "deleted"
}

export enum UserRole {
  Owner = "owner",
  Admin = "admin",
  Collaborator = "collaborator",
}

export type Organization = {
  id: string;
  name: string;
  logoURL?: string;
  detail?: OrganizationDetail;
}

export type OrganizationUser = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
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

export type OrganizationUserState = {
  isLoading: boolean;
  error: Error | string | null;
  users: OrganizationUser[];
  currentUser: OrganizationUser | null;
}
