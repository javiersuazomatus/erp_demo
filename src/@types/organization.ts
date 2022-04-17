export type Organization = {
  id: string;
  name: string;
  photoURL: string | null;
}

export type OrganizationUser = {
  id: string;
  name: string;
  estate: string;
  occupation: string
  photoURL: string | null;
  role: string;
}

export type OrganizationState = {
  isLoading: boolean;
  error: Error | string | null;
  organizations: OrganizationUser[];
  defaultOrganization: OrganizationUser | null;
  organization: Organization | null;
}

