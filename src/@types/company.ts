export type Company = {
  id: string;
  name: string;
  photoURL: string | null;
}

export type UserCompany = {
  id: string;
  name: string;
  estate: string;
  occupation: string
  photoURL: string | null;
  role: string;
}

export type CompanyState = {
  isLoading: boolean;
  error: Error | string | null;
  companies: UserCompany[];
  defaultCompany: UserCompany | null;
  company: Company | null;
}

