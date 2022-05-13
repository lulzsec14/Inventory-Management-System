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
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';

import { LoadingButton } from '@mui/lab';
import axios from 'axios';

export const CreateStock = () => {
  const user = {
    name: 'Sourav',
    avatar: '/static/mock-images/avatars/avatar_default.jpg',
    email: 'sourav121420@gmail.com',
    phoneNo: '8968613112',
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const [categoryData, setCategoryData] = useState([]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stock created successfully!'
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

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/getAllCats',
          options
        );

        // console.log(response.data.data);
        setCategoryData(response.data.data);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    fetchCats().then();
  }, []);

  const categories = ['Health', 'Electronics', 'Gym', 'Stationary'];

  const navigate = useNavigate();

  const stockDetails = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
    amount: Yup.number().positive().required(),
    quantity: Yup.number().positive().required(),
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
    onSubmit: async (values) => {
      try {
        alert(JSON.stringify(values, null, 2));
        const { data } = await axios.post(
          'http://localhost:5000/api/admin/createNewStock',
          {
            data: {
              name: values.name,
              category: values.category,
              seller: {
                name: values.sellerName,
                address: values.address,
                phoneNo: values.phoneNo,
              },
              amount: values.amount,
              quantity: values.quantity,
              paymentMode: values.mode,
              transactionId: values.transactionId,
            },
          },
          options
        );

        setSnackColor('success');
        setSnackMessage(data.message);
        setSnackOpen(true);
        await sleep(3000);
        navigate('/dashboard/stocks', { replace: true });
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }

      // alert(JSON.stringify(values, null, 2));
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
        </Stack>
        <Grid container spacing={3}>
          <Grid item lg={10}>
            <Card sx={{ padding: 5, width: '100%' }}>
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
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
                        >
                          {categoryData.map((val) => {
                            return (
                              <MenuItem key={val.name} value={val.name}>
                                {val.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
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
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        // key={'top'+'right'}
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
