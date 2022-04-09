import Layout from '../../layouts';
import Page from '../../components/Page';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import { MotionContainer, varBounce } from '../../components/animate';
import { m } from 'framer-motion';
import { PageNotFoundIllustration } from '../../assets';
import NextLink from 'next/link';
import { useDispatch, useSelector } from '../../redux/store';
import { loadCompanies } from '../../redux/slices/company';
import LoadingScreen from '../../components/LoadingScreen';
import New from './new';
import Page404 from '../404';
import DemoEditor from '../components/extra/editor';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

Companies.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>;
};

export default function Companies() {
  const {companies, isLoading } = useSelector((state) => state.company);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (companies.length == 0) {
    return <New />
  }

  return (
    <Page title='lala!' sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Welcome!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>
            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>
            <NextLink href="/">
              <Button size="large" variant="contained">
                Go to Home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
