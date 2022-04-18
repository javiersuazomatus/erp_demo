import { capitalCase } from 'change-case';
import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import useSettings from '../../hooks/useSettings';
import { _userAbout, _userAddressBook, _userInvoices, _userPayment } from '../../_mock';
import Layout from '../../layouts';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import {
  AccountBilling,
  AccountChangePassword,
  AccountGeneral,
  AccountNotifications,
  AccountSocialLinks,
} from '../../sections/@dashboard/user/account';
import AuthGuard from '../../guards/AuthGuard';
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>
    <Layout variant={'logoOnly'}>{page}</Layout>
  </AuthGuard>;
};


export default function UserAccount() {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'billing',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: (
        <AccountBilling
          cards={_userPayment}
          addressBook={_userAddressBook}
          invoices={_userInvoices}
        />
      ),
    },
    {
      value: 'notifications',
      icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
      component: <AccountNotifications />,
    },
    {
      value: 'social_links',
      icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
      component: <AccountSocialLinks myProfile={_userAbout} />,
    },
    {
      value: 'change_password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Page title='User: Account Settings'>
      <RootStyle>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Typography variant="h4" sx={{ mb: 2, textAlign: {xs: 'center', md: 'left'}}}>
            Account Settings
          </Typography>

          <Tabs
            value={currentTab}
            scrollButtons='auto'
            variant='scrollable'
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>

          <Box sx={{ mb: 5 }} />

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Container>
      </RootStyle>
    </Page>
  );
}
