import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { PATH_DASHBOARD, PATH_ORGANIZATION } from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import OrganizationLayout from '../../../../layouts/OrganizationLayout';
import Page from '../../../../components/Page';
import Label, { LabelColor } from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../../sections/@dashboard/user/list';
import { OrganizationUser, OrganizationUserState, UserState } from '../../../../@types/organization';
import LoadingScreen from '../../../../components/LoadingScreen';
import Page500 from '../../../500';
import { useSelector } from '../../../../redux/store';
import { useDispatch } from 'react-redux';
import { loadOrgUsers, refreshCurrentUser, refreshOrgUsers } from '../../../../redux/slices/organization-user';
import { updateOrganizationUser } from '../../../../clients/organization';
import { useSnackbar } from 'notistack';


const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'occupation', label: 'Occupation', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];


UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <OrganizationLayout>{page}</OrganizationLayout>;
};


export default function UserList() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { currentOrganization } = useSelector((state) => state.organization);
  const {
    users,
    currentUser,
    isLoading,
    error,
  }: OrganizationUserState = useSelector((state) => state.organizationUser);
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (currentOrganization && users?.length == 0) {
      dispatch(loadOrgUsers(currentOrganization.id));
    }
  }, [currentOrganization, users]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <Page500 />;

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleChangeStateUser = async (userId: string, state: UserState) => {
    console.log('handleChangeStateUser');
    try {
      await updateOrganizationUser(currentOrganization.id, userId, { state });
      const userIndex = users.findIndex(user => user.id == userId);
      const usersCopy = [...users];
      usersCopy[userIndex] = { ...usersCopy[userIndex], state };
      dispatch(refreshOrgUsers(usersCopy));
      if (currentUser) {
        dispatch(refreshCurrentUser(usersCopy[userIndex]));
      }
    } catch (error) {
      console.log({ error });
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  const handleDeleteMultiUser = (selected: string[]) => {
    const deleteUsers = users.filter((user) => !selected.includes(user.name));
    setSelected([]);
    // setUsers(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Page title='User: List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Users'
          links={[
            { name: 'Home', href: PATH_ORGANIZATION.detail.dashboard(currentOrganization.id) },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.user.newUser} passHref>
              <Button variant='contained' startIcon={<Iconify icon={'eva:plus-fill'} />}>
                Invite to Join
              </Button>
            </NextLink>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, role, state, occupation, photoURL } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                          </TableCell>
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={name} src={photoURL} sx={{ mr: 2 }} />
                            <Typography variant='subtitle2' noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align='left'>{occupation}</TableCell>
                          <TableCell align='left'>{role}</TableCell>
                          {/*<TableCell align='left'>{isVerified ? 'Yes' : 'No'}</TableCell>*/}
                          <TableCell align='left'>
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={getStateColor(state)}
                            >
                              {sentenceCase(state)}
                            </Label>
                          </TableCell>

                          <TableCell align='right'>
                            <UserMoreMenu
                              onActivate={() => handleChangeStateUser(id, UserState.Active)}
                              onBlock={() => handleChangeStateUser(id, UserState.Blocked)}
                              onDelete={() => handleChangeStateUser(id, UserState.Deleted)}
                              userId={id}
                              userState={state}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}


type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: OrganizationUser[],
  comparator: (a: any, b: any) => number,
  query: string,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function getStateColor(state: UserState): LabelColor {
  switch (state) {
    case UserState.Invited:
      return 'info';
    case UserState.Active:
      return 'success';
    case UserState.Blocked:
    case UserState.Deleted:
      return 'error';
    default:
      return 'warning';
  }
}
