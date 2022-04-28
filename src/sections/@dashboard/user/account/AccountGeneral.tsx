import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useAuth from '../../../../hooks/useAuth';
import { fData } from '../../../../utils/formatNumber';
import { countries } from '../../../../_mock';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { UserFormValues } from '../../../../@types/userProfile';

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, update } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    displayName: user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
    phoneNumber: user?.phoneNumber,
    country: user?.country,
    address: user?.address,
    state: user?.state,
    city: user?.city,
    zipCode: user?.zipCode,
    about: user?.about,
    isPublic: user?.isPublic,
  };

  const methods = useForm<UserFormValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log({ data });
      await update(data);
      enqueueSnackbar('Account successfully updated!');
    } catch (error) {
      console.log({ error });
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
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
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name='photoURL'
              accept='image/*'
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant='caption'
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name='isPublic'
              labelPlacement='start'
              label='Public Profile'
              sx={{ mt: 5 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name='displayName' label='Name' />
              <RHFTextField name='email' label='Email Address' />

              <RHFTextField name='organization' label='Organization' />

              <RHFTextField name='phoneNumber' label='Phone Number' />
              <RHFTextField name='address' label='Address' />

              <RHFSelect name='country' label='Country' placeholder='Country'>
                <option value='' />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name='state' label='State/Region' />

              <RHFTextField name='city' label='City' />
            </Box>

            <Stack spacing={3} alignItems='flex-end' sx={{ mt: 3 }}>
              <RHFTextField name='about' multiline rows={4} label='About' />

              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
