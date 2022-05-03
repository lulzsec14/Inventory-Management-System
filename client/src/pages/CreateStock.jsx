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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import Scrollbar from '../components/Scrollbar';

export const CreateStock = () => {
  const user = {
    name: 'Sourav',
    avatar: '/static/mock-images/avatars/avatar_default.jpg',
    email: 'sourav121420@gmail.com',
    phoneNo: '8968613112',
  };

  const categories = ['Health', 'Electronics', 'Gym', 'Stationary'];

  const navigate = useNavigate();

  const stockDetails = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
    amount: Yup.number().required(),
    quantity: Yup.number().required(),
    category: Yup.string().max(20, 'Too Long!').required(),
    sellerName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required(),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
    phoneNo: Yup.string().min(8, 'Too Short!').max(12, 'Too Long!').required(),
    mode: Yup.string().min(2, 'Too Short!').max(12, 'Too Long!').required(),
    transactionId: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      amount: '',
      quantity: '',
      category: '',
      sellerName: '',
      address: '',
      phoneNo: '',
      mode: '',
      transactionId: '',
    },
    validationSchema: stockDetails,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

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
        {/* <Scrollbar> */}
        <Grid container spacing={3}>
          <Grid item lg={10}>
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
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            width: '50%',
                          }}
                        >
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

                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="category"
                          id="category"
                          {...getFieldProps('category')}
                          label="Category"
                          // onChange={handleChange}
                        >
                          {categories.map((val) => {
                            return (
                              <MenuItem key={val} value={val}>
                                {val}
                              </MenuItem>
                            );
                          })}

                          {/* <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                      </FormControl>
                      {/* </Stack> */}
                      <Divider />

                      <Typography gutterBottom>Seller Details :</Typography>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <TextField
                          fullWidth
                          label="Name"
                          {...getFieldProps('sellerName')}
                          error={Boolean(
                            touched.sellerName && errors.sellerName
                          )}
                          helperText={touched.sellerName && errors.sellerName}
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
                        label="Address"
                        multiline
                        rows={4}
                        {...getFieldProps('address')}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />

                      <Divider />

                      <Typography gutterBottom>
                        Transaction Details :
                      </Typography>

                      <TextField
                        fullWidth
                        label="Transaction Mode"
                        {...getFieldProps('mode')}
                        error={Boolean(touched.mode && errors.mode)}
                        helperText={touched.mode && errors.mode}
                      />

                      <TextField
                        fullWidth
                        label="Transaction Id"
                        {...getFieldProps('transactionId')}
                        error={Boolean(
                          touched.transactionId && errors.transactionId
                        )}
                        helperText={
                          touched.transactionId && errors.transactionId
                        }
                      />

                      {/* <TextField
                        fullWidth
                        disabled={isEdit}
                        autoComplete="username"
                        type="email"
                        label="Email address"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      /> */}

                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Create
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        {/* </Scrollbar> */}
      </Container>
    </Page>
  );
};
