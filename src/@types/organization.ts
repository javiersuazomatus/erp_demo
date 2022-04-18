export type Organization = {
  id: string;
  name: string;
  logoURL: string | null;
}

export type OrganizationUser = {
  id: string;
  name: string;
  estate: string;
  occupation: string
  logoURL: string | null;
  role: string;
}

export type OrganizationState = {
  isLoading: boolean;
  error: Error | string | null;
  organizations: OrganizationUser[];
  defaultOrganization: OrganizationUser | null;
  organization: Organization | null;
}

export type OrganizationFormValues = {
  id: string;
  name: string;
  legalName: string;
  logo?: File;
  afterSubmit?: string;
};
