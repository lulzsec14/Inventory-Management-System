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

export const Receipt = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

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

  // const [data, setData] = useState([]);
  // const []
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/getPaymentsMade',
          options
        );
        const { mainData } = data.data;
        // setData(mainData);
        setBillData(mainData);
        // console.log(mainData);

        // console.log('Here');

        // console.log(billData);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage('Some error occured!');
        setSnackOpen(true);
      }
    };

    fetchBills().then();
    // console.log(billData);
  }, []);

  // console.log(billData);
  return (
    <Page title="Receipts">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Bills
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

        <Grid container spacing={3}>
          {/* {POSTS.map((post, index) => (
            <BillCard key={post.id} post={post} index={index} />
          ))} */}
          {billData.map((post, index) => (
            <BillCard key={post._id} post={post} index={index} />
          ))}
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
