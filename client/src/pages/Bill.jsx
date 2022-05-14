import { Link as RouterLink } from 'react-router-dom';
// material
import { useEffect, useState } from 'react';

import {
  Grid,
  Container,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
} from '@mui/material';
// components
import Page from '../components/Page';
import { BillCard, BillSort, BillSearch } from '../sections/dashboard/bill';
// mock
import axios from 'axios';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export const Bill = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stock created successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const [isLoading, setIsLoading] = useState(false);

  const handleSnackClick = () => {
    setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const [billData, setBillData] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true);

      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/getPaymentsRecieved',
          options
        );
        const { mainData } = data.data;

        setBillData(mainData);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage('Some error occured!');
        setSnackOpen(true);
      }
      setIsLoading(false);
    };

    fetchBills().then();
  }, []);

  return (
    <Page title="Bills">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Reciepts
          </Typography>
        </Stack>

        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BillSearch posts={billData} />
          <BillSort options={SORT_OPTIONS} />
        </Stack>

        {/* {isLoading ? (
          <CircularProgress size={'10rem'} />
        ) : ( */}
        <Grid container spacing={3}>
          {billData.map((post, index) => (
            <BillCard key={post._id} post={post} index={index} />
          ))}
        </Grid>
        {/* )} */}

        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
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
      </Container>
    </Page>
  );
};
