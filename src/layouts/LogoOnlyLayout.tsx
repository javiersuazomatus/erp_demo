import { ReactNode } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Toolbar } from '@mui/material';
// components
import Logo from '../components/Logo';
import AccountPopover from './dashboard/header/AccountPopover';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  children?: ReactNode;
};

export default function LogoOnlyLayout({ children }: Props) {
  return (
    <>
      <HeaderStyle>
        <Toolbar
          sx={{
            minHeight: '100% !important',
            px: { lg: 5 },
          }}
        >
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <AccountPopover />
        </Toolbar>
      </HeaderStyle>
      {children}
    </>
  );
}
