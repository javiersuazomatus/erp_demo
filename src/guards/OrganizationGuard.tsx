import { ReactNode, useEffect } from 'react';
import { useSelector } from '../redux/store';
import LoadingScreen from '../components/LoadingScreen';
import Page500 from '../pages/500';
import { WithoutOrganization } from '../sections/organizations/without';
import { useDispatch } from 'react-redux';
import { loadUserOrganizations } from '../redux/slices/organization';
import useAuth from '../hooks/useAuth';
import isEmpty from 'lodash/isEmpty'


type Props = {
  children: ReactNode;
};

export default function OrganizationGuard({ children }: Props) {
  console.log('OrganizationGuard');

  const dispatch = useDispatch();

  const { user } = useAuth();

  const { organizations, isLoading, error } = useSelector((state) => state.organization);
  console.log({ organizations, isLoading, error });

  useEffect(() => {
      if (user?.id && !organizations) {
        dispatch(loadUserOrganizations(user?.id));
      }
    },
    [user],
  );

  if (!isLoading) {
    if (error) {
      console.log('<- return 500');
      return <Page500 />;
    }

    if (isEmpty(organizations)) {
      console.log('<- return WithoutOrganization');
      return <WithoutOrganization />;
    } else {
      console.log('<- return children');
      return <>{children}</>;
    }
  }

  return <LoadingScreen />;
}
