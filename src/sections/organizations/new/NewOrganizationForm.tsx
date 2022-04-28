import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Alert, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import slugify from '../../../utils/slugify';
import { createOrganization } from '../../../clients/organization';
import { useDispatch } from '../../../redux/store';
import { loadUserOrganizations } from '../../../redux/slices/organization';
import { useRouter } from 'next/router';
import { PATH_ORGANIZATION } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import { fData } from '../../../utils/formatNumber';
import { useCallback } from 'react';
import { OrganizationFormValues } from '../../../@types/organization';

export default function NewOrganizationForm() {
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const { user } = useAuth();

  const defaultValues = {
    id: '',
    name: '',
    legalName: '',
  };

  const NewOrganizationSchema = Yup.object().shape({
    id: Yup.string().required('ID required'),
    name: Yup.string().required('Name required'),
    legalName: Yup.string().required('Legal name required'),
    ownerOccupation: Yup.string().required('Position or occupation required')
  });

  const methods = useForm<OrganizationFormValues>({
    resolver: yupResolver(NewOrganizationSchema),
    defaultValues,
  });

  const {
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onNameChange = (e: any) => {
    const { value } = e.target;
    setValue('name', value);
    setValue('id', slugify(value));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'logoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  const onSubmit = async (data: OrganizationFormValues) => {
    try {
      await createOrganization({
        id: data.id,
        name: data.name,
        legalName: data.legalName,
        logoURL: data.logoURL,
        ownerOccupation: data.ownerOccupation,
      }, user?.id);
      dispatch(loadUserOrganizations(user?.id));
      replace(PATH_ORGANIZATION.detail.dashboard(data.id));
    } catch (error) {
      console.error(error);
      setError('afterSubmit', {
        message: error.toString(),
      });
    }
  };

  console.log({ 'errors.afterSubmit': errors.afterSubmit });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <RHFTextField name='name' label='Name' onChange={onNameChange} />
        <RHFTextField name='id' label='ID' disabled />
        <RHFTextField name='legalName' label='Legal Name' />
        <RHFUploadAvatar
          name='logo'
          accept='image/*'
          maxSize={3145728}
          onDrop={handleDrop}
          labelText={'logo'}
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
        <RHFTextField name='ownerOccupation' label='Position or Occupation' />


        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
        >
          Create Organization
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
