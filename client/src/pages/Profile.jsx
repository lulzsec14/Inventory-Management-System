import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Grid,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  CardContent,
  Avatar,
  Box,
  Divider,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { addUser } from '../store/store';
import Cookies from 'js-cookie';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import Label from '../components/Label';
import axios from 'axios';

export const Profile = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    credentials: 'include',
  };

  const [isVerified, setIsVerified] = useState(true);
  const user = {
    name: 'Sourav',
    avatar: '/static/mock-images/avatars/avatar_default.jpg',
    email: 'sourav121420@gmail.com',
    phoneNo: '8968613112',
  };

  const userDetails = useSelector((state) => state.user.value);
  const userDispatcher = useDispatch();

  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  const UserDetails = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    // .required('Aivin'),
    phoneNo: Yup.string().min(8, 'Too Short!').max(12, 'Too Long!'),
  });

  const [oldPassword, setOldPassword] = useState(false);

  const [newPassword, setNewPassword] = useState(false);

  const [detailsChanged, setDetailsChanged] = useState(false);

  // SnackBar

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Adminn Logged In successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const handleSnackClick = () => {
    setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  // ----------------------------------

  const UserPassword = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, 'Password cant be less than 8 chars!')
      .required('Old Password is required!'),
    newPassword: Yup.string()
      .min(8, 'Password cant be less than 8 chars!')
      .required('New Password is required!')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 8 characters, one uppercase, one number and one special case character'
      ),
  });

  const formik = useFormik({
    initialValues: {
      fullName: userDetails.name || ' ',
      phoneNo: userDetails.phoneNo || ' ',
      email: userDetails.email || ' ',
    },
    validationSchema: UserDetails,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));

      try {
        const response = await axios.put(
          `http://localhost:5000/api/admin/updateAdminDetails`,
          {
            data: {
              email: values.email,
              dataToUpdate: {
                name: values.fullName,
                phoneNo: values.phoneNo,
              },
            },
          },
          options
        );

        Cookies.remove('user');

        userDispatcher(addUser(response.data.data));
        Cookies.set('user', JSON.stringify(response.data.data), { expires: 1 });
        setIsEdit(false);

        setDetailsChanged((prev) => !prev);

        setSnackColor('success');
        setSnackMessage(response.data.message);
        setSnackOpen(true);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    },
  });

  const passwordForm = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: UserPassword,
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));

      try {
        const response = await axios.put(
          'http://localhost:5000/api/admin/updateAdminPassword',
          {
            data: {
              email: formik.values.email,
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
            },
          },
          options
        );

        setSnackColor('success');
        setSnackMessage('Password updated successfully!');
        setSnackOpen(true);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    },
  });

  const handleEdit = () => {
    setIsEdit(true);
  };

  // For email verification

  const [verifyButtonLoading, setVerifyButtonLoading] = useState(false);

  const verifyEmail = async () => {
    try {
      setVerifyButtonLoading(true);
      // console.log('Here');
      const USER_DETAILS = JSON.parse(Cookies.get('user'));

      const response = await axios.get(
        `http://localhost:5000/api/admin/getEmailVerification?email=${USER_DETAILS.email}`,
        options
      );

      setVerifyButtonLoading(false);
      setSnackColor('success');
      setSnackMessage('Verification email sent successfully!');
      setSnackOpen(true);

      // console.log('Reached Here');
      // console.log(response);
      setDetailsChanged((prev) => !prev);
    } catch (err) {
      setSnackColor('error');
      setSnackMessage(err?.response?.data?.error);
      setSnackOpen(true);
      setVerifyButtonLoading(false);
    }
  };

  const handleVerify = () => {
    verifyEmail().then();
  };

  // --------------------------------------------

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const passwordErrors = passwordForm.errors;
  const passwordTouched = passwordForm.touched;
  const passwordHandleSubmit = passwordForm.handleSubmit;
  const passwordIsSubmitting = passwordForm.isSubmitting;
  const passwordGetFieldProps = passwordForm.getFieldProps;

  useEffect(() => {
    const USER_DETAILS = JSON.parse(Cookies.get('user'));
    console.log(USER_DETAILS);
    formik.values.fullName = USER_DETAILS.name;
    formik.values.phoneNo = USER_DETAILS.phoneNo;
    formik.values.email = USER_DETAILS.email;
    userDispatcher(addUser(USER_DETAILS));
    setIsVerified(USER_DETAILS.isVerified);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/getAdminDetails/${formik.values.email}`,
          options
        );

        console.log(data);

        userDispatcher(addUser(data.data));

        Cookies.remove('user');
        Cookies.set('user', JSON.stringify(data.data), { expires: 1 });
      } catch (err) {
        setSnackColor('error');
        setSnackMessage("Couldn't fetch user details");
        setSnackOpen(true);
      }
    };

    fetchUserDetails().then();
  }, [detailsChanged]);

  return (
    <Page title="Dashboard: Profile">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Account
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="ci:edit" />}
            onClick={handleEdit}
          >
            Edit Details
          </Button>
        </Stack>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Card sx={{ minWidth: 350 }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      height: 150,
                      mb: 2,
                      width: 150,
                    }}
                  />
                </Box>

                <Divider>
                  {isVerified ? (
                    <Iconify
                      icon="material-symbols:verified-user-rounded"
                      width={34}
                      height={34}
                      sx={{ align: 'right', color: 'green' }}
                    />
                  ) : (
                    <Iconify
                      icon="carbon:unknown-filled"
                      width={34}
                      height={34}
                      sx={{ align: 'right', color: 'orange' }}
                    />
                  )}
                </Divider>

                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {userDetails.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {userDetails.email}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {userDetails.phoneNo}
                  </Typography>

                  {isVerified ? (
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={verifyButtonLoading}
                      disabled
                    >
                      Verify Email
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      loading={verifyButtonLoading}
                      onClick={handleVerify}
                    >
                      Verify Email
                    </LoadingButton>
                  )}
                </Box>
              </CardContent>
              <Divider />
            </Card>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Card sx={{ minHeight: 300, padding: 5, width: '100%' }}>
              <Typography sx={{ marginBottom: 2 }}>Admin Profile :</Typography>
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <TextField
                          fullWidth
                          disabled={!isEdit}
                          label="Full name"
                          {...getFieldProps('fullName')}
                          error={Boolean(touched.fullName && errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                        />

                        <TextField
                          fullWidth
                          disabled={!isEdit}
                          label="Phone No"
                          {...getFieldProps('phoneNo')}
                          error={Boolean(touched.phoneNo && errors.phoneNo)}
                          helperText={touched.phoneNo && errors.phoneNo}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        disabled
                        type="email"
                        label="Email address"
                        {...getFieldProps('email')}
                      />

                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Save Details
                      </LoadingButton>

                      <Divider />
                    </Stack>
                  </Form>
                </FormikProvider>
              </Grid>

              <Grid item xs={12} padding={2}>
                <Typography sx={{ marginBottom: 2 }}>
                  Change Password :
                </Typography>
                <FormikProvider value={passwordForm}>
                  <Form
                    autoComplete="off"
                    noValidate
                    onSubmit={passwordHandleSubmit}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={oldPassword ? 'text' : 'password'}
                        label="Old Password"
                        {...passwordGetFieldProps('oldPassword')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setOldPassword((prev) => !prev)}
                              >
                                <Iconify
                                  icon={
                                    oldPassword
                                      ? 'eva:eye-fill'
                                      : 'eva:eye-off-fill'
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(
                          passwordTouched.oldPassword &&
                            passwordErrors.oldPassword
                        )}
                        helperText={
                          passwordTouched.oldPassword &&
                          passwordErrors.oldPassword
                        }
                      />

                      <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={newPassword ? 'text' : 'password'}
                        label="New Password"
                        {...passwordGetFieldProps('newPassword')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setNewPassword((prev) => !prev)}
                              >
                                <Iconify
                                  icon={
                                    newPassword
                                      ? 'eva:eye-fill'
                                      : 'eva:eye-off-fill'
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(
                          passwordTouched.newPassword &&
                            passwordErrors.newPassword
                        )}
                        helperText={
                          passwordTouched.newPassword &&
                          passwordErrors.newPassword
                        }
                      />

                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={passwordIsSubmitting}
                      >
                        Change Password!
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackColor}
          sx={{ width: '100%' }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
};
