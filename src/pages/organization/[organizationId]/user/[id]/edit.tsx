import { capitalCase } from 'change-case';
import { useRouter } from 'next/router';
import { Container } from '@mui/material';
import { PATH_ORGANIZATION } from '../../../../../routes/paths';
import useSettings from '../../../../../hooks/useSettings';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import UserEditForm from '../../../../../sections/@dashboard/user/UserEditForm';
import { useSelector } from '../../../../../redux/store';
import { OrganizationUserState } from '../../../../../@types/organization';
import { useEffect } from 'react';
import { loadCurrentUser } from '../../../../../redux/slices/organization-user';
import LoadingScreen from '../../../../../components/LoadingScreen';
import Page500 from '../../../../500';
import { useDispatch } from 'react-redux';
import Page404 from '../../../../404';
import OrganizationLayout from '../../../../../layouts/OrganizationLayout';

UserEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <OrganizationLayout>{page}</OrganizationLayout>;
};

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();
  const { id } = query;
  const userId = Array.isArray(id) ? id[0] : id;

  const { currentOrganization } = useSelector((state) => state.organization);
  const { currentUser, isLoading, error }: OrganizationUserState = useSelector((state) => state.organizationUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentOrganization && userId && currentUser?.id !== userId) {
      dispatch(loadCurrentUser(userId));
    }
  }, [currentOrganization, currentUser, id]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <Page500 />;

  if (currentUser) {
    return (
      <Page title='User: Edit user'>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading='Edit user'
            links={[
              { name: 'Home', href: PATH_ORGANIZATION.detail.dashboard(currentOrganization.id) },
              { name: 'List', href: PATH_ORGANIZATION.detail.users.list(currentOrganization.id) },
              { name: capitalCase(currentUser.name as string) },
            ]}
          />
          <UserEditForm isEdit currentUser={currentUser} />
        </Container>
      </Page>
    );
  }

  return <Page404 />;
}
