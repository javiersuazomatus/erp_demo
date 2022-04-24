import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import { useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import OrganizationAvatar from '../../../components/OrganizationAvatar';
import { Organization } from '../../../@types/organization';


const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));


type Props = {
  isCollapse: boolean | undefined;
};

export default function NavbarAccount({ isCollapse }: Props) {
  const { currentOrganization }: { currentOrganization: Organization } =
    useSelector((state) => state.organization);

  return (
    <NextLink href={PATH_DASHBOARD.user.account} passHref>
      <Link underline='none' color='inherit'>
        <RootStyle
          sx={{
            ...(isCollapse && {
              bgcolor: 'transparent',
            }),
          }}
        >
          <OrganizationAvatar />

          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shorter,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
              }),
            }}
          >
            <Typography variant='subtitle2' noWrap>
              {currentOrganization.name}
            </Typography>
          </Box>
        </RootStyle>
      </Link>
    </NextLink>
  );
}
