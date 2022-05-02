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
// import AccountCircle from '@mui/icons-material/AccountCircle';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';

import { LoadingButton } from '@mui/lab';

export const CreateStock = () => {
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
      name: '',
      amount: null,
      quantity: null,
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
    <Page title="Create Stock">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Create Stock
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="ci:edit" />}
            onClick={handleEdit}
          >
            Edit Details
          </Button> */}
        </Stack>
        <Grid container spacing={3}>
          <Grid item>
            <Card sx={{ padding: 5, width: '100%' }}>
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      {/* <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      > */}
                      <TextField
                        fullWidth
                        label="Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                          <MonetizationOnSharpIcon
                            sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                          />
                          <TextField
                            fullWidth
                            // id="input-with-sx"
                            label="Amount"
                            type="number"
                            variant="standard"
                            {...getFieldProps('amount')}
                            error={Boolean(touched.amount && errors.amount)}
                            helperText={touched.amount && errors.amount}
                          />
                        </Box>

                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          {...getFieldProps('quantity')}
                          error={Boolean(touched.quantity && errors.quantity)}
                          helperText={touched.quantity && errors.quantity}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        label="Phone No"
                        {...getFieldProps('phoneNo')}
                        error={Boolean(touched.phoneNo && errors.phoneNo)}
                        helperText={touched.phoneNo && errors.phoneNo}
                      />
                      {/* </Stack> */}

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
