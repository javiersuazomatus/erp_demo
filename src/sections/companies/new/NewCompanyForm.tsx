import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { Alert, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import slugify from '../../../utils/slugify';

type FormValuesProps = {
  id: string;
  name: string;
  legalName: string;
  afterSubmit?: string;
};

export default function NewCompanyForm() {
  const isMountedRef = useIsMountedRef();

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
    reValidateMode: 'onChange'
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
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(error);
      setError('afterSubmit', {
        message: error
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <RHFTextField name='name' label='Name' onChange={onNameChange} />
        <RHFTextField name='id' label='ID' disabled/>
        <RHFTextField name='legalName' label='Legal Name'/>

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
