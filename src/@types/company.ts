// ----------------------------------------------------------------------

export type Company = {
  id: string;
  name: string;
  photoURL: string;
}

export type CompanyState = {
  isLoading: boolean;
  error: Error | string | null;
  companies: Company[];
  company: Company | null;
}
