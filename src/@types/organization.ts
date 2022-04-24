export type Organization = {
  id: string;
  name: string;
  logoURL?: string;
  user?: {
    role: string;
    estate: string;
    occupation: string
  }
  detail?: OrganizationDetail;
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
  logo?: File;
  afterSubmit?: string;
};
