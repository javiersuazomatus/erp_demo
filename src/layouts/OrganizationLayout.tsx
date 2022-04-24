import { ReactNode } from 'react';
import AdminLayout, { GroupItem } from './admin';
import AuthGuard from '../guards/AuthGuard';
import OrganizationGuard from '../guards/OrganizationGuard';
import { useRouter } from 'next/router';
import organizationNavConfig from '../pages/organization/[organizationId]/NavConfig';
import CurrentOrganizationGuard from '../guards/CurrentOrganizationGuard';

type Props = {
  children: ReactNode;
  navConfig?: GroupItem[]
};

export default function OrganizationLayout({ children }: Props) {

  const { query } = useRouter();
  const { organizationId } = query;
  const orgId = Array.isArray(organizationId) ? organizationId[0] : organizationId;

  return (
    <AuthGuard>
      <OrganizationGuard>
        <CurrentOrganizationGuard>
          <AdminLayout navConfig={organizationNavConfig(orgId || '')}> {children} </AdminLayout>
        </CurrentOrganizationGuard>
      </OrganizationGuard>
    </AuthGuard>
  );
}
