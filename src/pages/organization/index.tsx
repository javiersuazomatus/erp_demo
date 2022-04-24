import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_ORGANIZATION } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import { useSelector } from '../../redux/store';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();

  const { user } = useAuth();
  const defaultOrganizationId = user?.defaultOrganizationId;

  const path = defaultOrganizationId
    ? PATH_ORGANIZATION.detail.dashboard(defaultOrganizationId)
    : PATH_ORGANIZATION.list;

  useEffect(() => {
    if (pathname === PATH_ORGANIZATION.root) {
      replace(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
