import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Alert, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import slugify from '../../../utils/slugify';
import { createCompany } from '../../../clients/company';
import { useDispatch } from '../../../redux/store';
import { loadCompanies } from '../../../redux/slices/company';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';

type FormValuesProps = {
  id: string;
  name: string;
  legalName: string;
  afterSubmit?: string;
};

export default function NewCompanyForm() {
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const { user } = useAuth();

  const defaultValues = {
    id: '',
    name: '',
    legalName: '',
  };

  const NewCompanySchema = Yup.object().shape({
    id: Yup.string().required('ID required'),
    name: Yup.string().required('Name required'),
    legalName: Yup.string().required('Legal Name required'),
  });


  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCompanySchema),
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

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await createCompany({
        id: data.id,
        name: data.name,
        photoURL: null,
      }, user?.id);
      dispatch(loadCompanies(user?.id, data.id));
      replace(PATH_DASHBOARD.general.app);
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

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
        >
          Create Company
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
