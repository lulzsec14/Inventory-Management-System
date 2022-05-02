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
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';

import { LoadingButton } from '@mui/lab';

export const Profile = () => {
  const user = {
    name: 'Sourav',
    avatar: '/static/mock-images/avatars/avatar_default.jpg',
    email: 'sourav121420@gmail.com',
    phoneNo: '8968613112',
  };

  const [isEdit, setIsEdit] = useState(true);

  const [disableEmail, setDisableEmail] = useState(true);

  const navigate = useNavigate();

  const UserDetails = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    phoneNo: Yup.string().min(8, 'Too Short!').max(12, 'Too Long!'),
  });

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: user.name,
      phoneNo: user.phoneNo,
      email: user.email,
      password: '',
    },
    validationSchema: UserDetails,
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });

  const handleEdit = () => {
    setIsEdit(true);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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

                  <Divider variant="middle" />

                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {user.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {user.email}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {user.phoneNo}
                  </Typography>
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
                          label="Full name"
                          {...getFieldProps('fullName')}
                          error={Boolean(touched.fullName && errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                        />

                        <TextField
                          fullWidth
                          label="Phone No"
                          {...getFieldProps('phoneNo')}
                          error={Boolean(touched.phoneNo && errors.phoneNo)}
                          helperText={touched.phoneNo && errors.phoneNo}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        disabled={isEdit}
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
                              <IconButton
                                edge="end"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                <Iconify
                                  icon={
                                    showPassword
                                      ? 'eva:eye-fill'
                                      : 'eva:eye-off-fill'
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />

                      {/* <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Register
                    </LoadingButton> */}
                    </Stack>
                  </Form>
                </FormikProvider>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
