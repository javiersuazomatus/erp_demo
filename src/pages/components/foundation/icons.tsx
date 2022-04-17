import { styled } from '@mui/material/styles';
import { Box, Container, Link, Stack, SvgIcon } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { Block } from '../../../sections/overview/Block';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' },
} as const;

// ----------------------------------------------------------------------

FoundationIcons.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function FoundationIcons() {
  return (
    <Page title="Foundations: Icons">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container>
            <HeaderBreadcrumbs
              heading="Icons"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Icons' }]}
              moreLink={[
                'https://mui.com/components/material-icons',
                'https://iconify.design/icon-sets',
              ]}
            />
          </Container>
        </Box>

        <Container>
          <Stack spacing={3}>
            <Box sx={{ position: 'relative' }}>
              <Block title="Material Icons" sx={style}>
                <Link
                  href="https://mui.com/components/icons/#main-content"
                  target="_blank"
                  rel="noopener"
                >
                  https://mui.com/components/icons/#main-content
                </Link>
              </Block>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Block title="Iconify Icons" sx={style}>
                <SvgIcon color="action">
                  <Iconify icon={'eva:alert-circle-fill'} width={24} height={24} />
                </SvgIcon>
                <SvgIcon color="disabled">
                  <Iconify icon={'eva:charging-fill'} width={24} height={24} />
                </SvgIcon>
                <SvgIcon color="error">
                  <Iconify icon={'eva:arrow-circle-down-fill'} width={24} height={24} />
                </SvgIcon>
                <SvgIcon color="inherit">
                  <Iconify icon={'eva:clock-fill'} width={24} height={24} />
                </SvgIcon>
                <SvgIcon color="primary">
                  <Iconify icon={'eva:color-palette-fill'} width={24} height={24} />
                </SvgIcon>
                <SvgIcon color="secondary">
                  <Iconify icon={'eva:color-palette-fill'} width={24} height={24} />
                </SvgIcon>
              </Block>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Block title="Local Icons" sx={style}>
                <SvgIconStyle src="/icons/browser-edge.svg" />
                <SvgIconStyle
                  src="/icons/browser-edge.svg"
                  sx={{ color: 'action.active' }}
                />
                <SvgIconStyle
                  src="/icons/browser-edge.svg"
                  sx={{ color: 'action.disabled' }}
                />
                <SvgIconStyle
                  src="/icons/browser-edge.svg"
                  sx={{ color: 'primary.main' }}
                />
                <SvgIconStyle
                  src="/icons/browser-edge.svg"
                  sx={{ color: 'secondary.main' }}
                />
                <SvgIconStyle
                  src="/icons/elephant.svg"
                  sx={{ color: 'info.main' }}
                />
                <SvgIconStyle
                  src="/icons/json-logo.svg"
                  sx={{ color: 'success.main' }}
                />
                <SvgIconStyle
                  src="/icons/love-camera.svg"
                  sx={{ color: 'warning.main' }}
                />
                <SvgIconStyle
                  src="/icons/shield.svg"
                  sx={{ color: 'error.main' }}
                />
              </Block>
            </Box>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}
