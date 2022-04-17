import Page from '../../components/Page';
import { Box, Card, Container, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SeoIllustration from '../../assets/illustration_seo';
import AuthGuard from '../../guards/AuthGuard';
import Logo from '../../components/Logo';
import useResponsive from '../../hooks/useResponsive';
import { NewCompanyForm } from '../../sections/companies/new';
import AccountPopover from '../../layouts/dashboard/header/AccountPopover';
import useAuth from '../../hooks/useAuth';

/*const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));*/

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

export default function NewCompany() {
  console.log('NewCompany');
  const mdUp = useResponsive('up', 'md');

  return (
    <AuthGuard>
      <Page title="New Company">
        <RootStyle>
          <HeaderStyle>
            <Logo />
            <Box sx={{ flexGrow: 1 }} />
            <AccountPopover />
          </HeaderStyle>
          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                Manage the job more effectively with Minimal
              </Typography>
              <SeoIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </SectionStyle>
          )}

          <Container>
            <ContentStyle>
              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Welcome!
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Get started creating your own Company Account.
                  </Typography>
                </Box>
              </Box>

              <NewCompanyForm />

              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
                By creating, I agree to Minimal {' '}
                <Link underline="always" color="text.primary" href="#">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link underline="always" color="text.primary" href="#">
                  Privacy Policy
                </Link>
                .
              </Typography>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </AuthGuard>

  );
}
