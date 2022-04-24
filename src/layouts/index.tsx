import { ReactNode } from 'react';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import AdminLayout, { GroupItem } from './admin';
import LogoOnlyLayout from './LogoOnlyLayout';
import OrganizationGuard from '../guards/OrganizationGuard';
import navDefaultConfig from './admin/navbar/NavConfig'

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'admin' | 'logoOnly';
  navConfig?: GroupItem[]
};

export default function Layout({ variant = 'admin', children, navConfig }: Props) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <AuthGuard>
      <OrganizationGuard>
        <AdminLayout navConfig={navConfig || navDefaultConfig}> {children} </AdminLayout>
      </OrganizationGuard>
    </AuthGuard>
  );
}
