import Page from '../../components/Page';
import { Box, Button, Container, Typography } from '@mui/material';
import { MotionContainer, varBounce } from '../../components/animate';
import { m } from 'framer-motion';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import SeoIllustration from '../../assets/illustration_seo';
import Layout from '../../layouts';
import AuthGuard from '../../guards/AuthGuard';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

NewCompany.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant='logoOnly'>{page}</Layout>;
};

export default function NewCompany() {
  console.log('NewCompany');
  return (
    <AuthGuard>
      <Page title='Welcome!' sx={{ height: 1 }}>
        <RootStyle>
          <Container component={MotionContainer}>
            <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
              <m.div variants={varBounce().in}>
                <Typography variant='h3' paragraph>
                  Welcome!
                </Typography>
              </m.div>
              <Typography sx={{ color: 'text.secondary' }}>
                You can start creating your own Company Account.
              </Typography>
              <m.div variants={varBounce().in}>
                <SeoIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
              </m.div>
              <NextLink href='/'>
                <Button size='large' variant='contained'>
                  Create Company
                </Button>
              </NextLink>
            </Box>
          </Container>
        </RootStyle>
      </Page>
    </AuthGuard>

  );
}
