import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { UserManager } from '../../../@types/userProfile';
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { OrganizationUser, UserRole } from '../../../@types/organization';
import Avatar from '../../../components/Avatar';
import createAvatar from '../../../utils/createAvatar';


type FormValuesProps = UserManager;

type Props = {
  currentUser?: OrganizationUser;
};

export default function UserEditForm({ currentUser }: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    occupation: Yup.string().required('occupation is required'),
    organization: Yup.string().required('Organization is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role Number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      state: currentUser?.state || '',
      role: currentUser?.role || '',
      avatarUrl: currentUser?.photoURL || '',
      occupation: currentUser?.occupation || '',
      // isVerified: currentUser?.isVerified || true,
    }),
    [currentUser],
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Update success!');
      push(PATH_DASHBOARD.user.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 3, px: 3 }}>
            <Label
              color={values.state !== 'active' ? 'error' : 'success'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {values.state}
            </Label>
            <Avatar
              src={`${currentUser?.photoURL}`}
              alt={currentUser?.name}
              color={currentUser?.photoURL || !currentUser?.email
                ? 'default'
                : createAvatar(currentUser?.name).color}
              sx={{
                mb: 3,
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                width: 128,
                height: 128,

              }}
            >
              {currentUser?.name && createAvatar(currentUser.name).name}
            </Avatar>
            <Typography
              variant='h5'
              sx={{
                display: 'block',
                textAlign: 'center',
              }}>
              {currentUser?.name}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                mb: 2,
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
              }}>
              {currentUser?.email}
            </Typography>
            {(
              <FormControlLabel
                labelPlacement='start'
                control={
                  <Controller
                    name='state'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFSelect name='role' label='Role' placeholder='Role'>
                {(Object.values(UserRole)).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name='phoneNumber' label='Phone Number' />
              <RHFTextField name='city' label='City' />
              <RHFTextField name='address' label='Address' />
              <RHFTextField name='zipCode' label='Zip/Code' />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sm={2}>
                <LoadingButton color="error" type='submit' variant='contained' loading={isSubmitting}>
                  Delete
                </LoadingButton>
              </Grid>
              <Grid item  xs={8} sm={10}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  The user can only be activated again by means of a new invitation.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
