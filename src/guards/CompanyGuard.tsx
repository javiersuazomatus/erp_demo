import { ReactNode } from 'react';

// redux
import { useSelector } from '../redux/store';

// components
import LoadingScreen from '../components/LoadingScreen';
import Page500 from '../pages/500';

//routes
import { useRouter } from 'next/router';
import { PATH_COMPANIES } from '../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function CompanyGuard({ children }: Props) {
  console.log('CompanyGuard');
  const { push } = useRouter();

  const { companies, company, isLoading, error } = useSelector((state) => state.company);
  console.log('companies.length === 0', companies.length === 0)

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <Page500 />;
  }

  if (companies.length === 0) {
    console.log('push(PATH_COMPANIES.new)');
    push(PATH_COMPANIES.new);
  } else if (!company) {
    console.log('push(PATH_COMPANIES.manage)');
    push(PATH_COMPANIES.manage);
  } else {
    console.log('<- return children');
    return <>{children}</>;
  }
  return <LoadingScreen />;
}
