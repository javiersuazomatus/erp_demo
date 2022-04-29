import { m } from 'framer-motion';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import Layout from '../../layouts';
import Page from '../../components/Page';
import { MotionContainer, varBounce } from '../../components/animate';
import { PageNotFoundIllustration } from '../../assets';
import OrganizationGuard from '../../guards/OrganizationGuard';
import AuthGuard from '../../guards/AuthGuard';


const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));


OrganizationsList.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>
    <OrganizationGuard>
      <Layout variant='logoOnly'>{page}</Layout>
    </OrganizationGuard>
  </AuthGuard>;
};


export default function OrganizationsList() {
  return (
    <Page title='Organizations' sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant='h3' paragraph>
                Sorry, page not found!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              AQUI VA LA LISTA
            </Typography>
            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>
            <NextLink href='/'>
              <Button size='large' variant='contained'>
                Go to Home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
