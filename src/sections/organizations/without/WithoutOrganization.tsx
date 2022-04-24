import { m } from 'framer-motion';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { MotionContainer, varBounce } from '../../../components/animate';
import { PATH_ORGANIZATION } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import SeoIllustration from '../../../assets/illustration_seo';


const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));


export default function WithoutOrganization() {
  const { user } = useAuth();

  return (
    <Layout variant='logoOnly'>
      <Page title={`Welcome ${user?.displayName}`} sx={{ height: 1 }}>
        <RootStyle>
          <Container component={MotionContainer}>
            <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
              <m.div variants={varBounce().in}>
                <Typography variant='h3' paragraph>
                  {`Welcome ${user?.displayName}`}!
                </Typography>
              </m.div>
              <Typography sx={{ color: 'text.secondary' }}>
                If you want to join an organization, ask one of their administrators to send you an email invitation.
              </Typography>
              <m.div variants={varBounce().in}>
                <SeoIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
              </m.div>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>
              <NextLink href={PATH_ORGANIZATION.new}>
                <Button size='large' variant='contained'>
                  Create a New Organization
                </Button>
              </NextLink>
            </Box>
          </Container>
        </RootStyle>
      </Page>
    </Layout>
  );
}
