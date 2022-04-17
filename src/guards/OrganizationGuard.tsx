import { ReactNode } from 'react';

// redux
import { useSelector } from '../redux/store';

// components
import LoadingScreen from '../components/LoadingScreen';
import Page500 from '../pages/500';

//routes
import { useRouter } from 'next/router';
import { PATH_ORGANIZATIONS } from '../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function OrganizationGuard({ children }: Props) {
  console.log('OrganizationGuard');
  const { replace } = useRouter();

  const { organization, isLoading, error } = useSelector((state) => state.organization);
  console.log({ organization, isLoading, error })

  if (!isLoading) {
    if (error) {
      console.log('<- return 500');
      return <Page500 />;
    }

    if (!organization) {
      console.log('-> push(PATH_ORGANIZATIONS.new)');
      replace(PATH_ORGANIZATIONS.new);
    } else {
      console.log('<- return children');
      return <>{children}</>;
    }
  }

  return <LoadingScreen />;
}
