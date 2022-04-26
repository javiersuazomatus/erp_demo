import { ReactNode, useEffect } from 'react';
import { useSelector } from '../redux/store';
import LoadingScreen from '../components/LoadingScreen';
import Page500 from '../pages/500';
import { useDispatch } from 'react-redux';
import { loadCurrentOrganization } from '../redux/slices/organization';
import Page404 from '../pages/404';
import { useRouter } from 'next/router';


type Props = {
  children: ReactNode;
};

export default function CurrentOrganizationGuard({ children }: Props) {
  console.log('OrganizationGuard');

  const dispatch = useDispatch();

  const { query } = useRouter();

  const { organizationId } = query;
  const orgId = Array.isArray(organizationId) ? organizationId[0] : organizationId;

  const { currentOrganization, isLoading, error } = useSelector((state) => state.organization);
  console.log({ currentOrganization, isLoading, error });

  useEffect(() => {
      console.log('useEffect', { currentOrganization });
      if (orgId && (!currentOrganization || currentOrganization.id !== orgId)) {
        dispatch(loadCurrentOrganization(orgId));
      }
    },
    [],
  );

  if (!isLoading) {
    if (error) {
      console.log('<- return 500');
      return <Page500 />;
    } else if (!currentOrganization) {
      console.log('<- return Page404');
      return <Page404 />;
    } else {
      console.log('<- return children');
      return <>{children}</>;
    }
  }

  return <LoadingScreen />;
}
