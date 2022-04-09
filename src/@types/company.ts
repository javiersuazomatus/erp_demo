// ----------------------------------------------------------------------

export type Company = {
  id: string;
  default: boolean;
  name: string;
  occupation: string
  photoURL: string;
  role: string;
}

export type CompanyState = {
  isLoading: boolean;
  error: Error | string | null;
  companies: Company[];
  company: Company | null;
}
