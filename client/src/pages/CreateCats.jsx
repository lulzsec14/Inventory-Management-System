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

import { LoadingButton } from '@mui/lab';
import axios from 'axios';

export const CreateCats = () => {
  // const user = {
  //   name: 'Sourav',
  //   avatar: '/static/mock-images/avatars/avatar_default.jpg',
  //   email: 'sourav121420@gmail.com',
  //   phoneNo: '8968613112',
  // };

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

  const navigate = useNavigate();

  const stockDetails = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: stockDetails,
    onSubmit: async (values) => {
      try {
        // alert(JSON.stringify(values, null, 2));
        const { data } = await axios.post(
          'http://localhost:5000/api/admin/createCategory',
          {
            data: {
              category: values.name,
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
            Add Category
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item lg={10}>
            <Card sx={{ padding: 5, width: '100%' }}>
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <Typography gutterBottom>Category :</Typography>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <TextField
                          sx={{ width: '40%' }}
                          label="Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                        <LoadingButton
                          sx={{ width: '40%' }}
                          size="large"
                          type="submit"
                          variant="contained"
                          loading={isSubmitting}
                        >
                          Create
                        </LoadingButton>
                      </Stack>
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
