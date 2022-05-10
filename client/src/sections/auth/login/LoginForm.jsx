import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Iconify from '../../../components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { addAuth } from '../../../store/authStore';
import axios from 'axios';
import Cookies from 'js-cookie';
import { addUser } from '../../../store/store';

export default function LoginForm({
  setSnackOpen,
  setSnackMessage,
  setSnackColor,
}) {
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    credentials: 'include',
  };

  const userDispatcher = useDispatch();

  const navigate = useNavigate();

  const authDispatcher = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required').min(8),
  });

  // const tempUserDetails = useSelector((state) => state.user.value);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // authDispatcher(addAuth(true));

      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/admin/loginAdmin',
          {
            data: {
              email: values.email,
              password: values.password,
            },
          },
          options
        );

        authDispatcher(addAuth(true));

        userDispatcher(addUser(data.adminDetails));

        Cookies.set('user', JSON.stringify(data.adminDetails), { expires: 1 });
        Cookies.set('auth', JSON.stringify({ isAuth: true }), { expires: 1 });

        setSnackColor('success');
        setSnackMessage(data.message);
        setSnackOpen(true);
        await sleep(3000);
        navigate('/dashboard/app', { replace: true });
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify
                      icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps('remember')}
                checked={values.remember}
              />
            }
            label="Remember me"
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            to="#"
            underline="hover"
          >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
