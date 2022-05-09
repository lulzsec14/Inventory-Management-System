import React from 'react';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Snackbar, Alert } from '@mui/material';
import { AppWidgetSummary } from '../sections/dashboard/app';
import { AppTotalSales } from '../sections/dashboard/app';
import CategorySales from '../sections/dashboard/app/CategorySales';
import { useEffect, useState } from 'react';

import axios from 'axios';

export const DashboardApp = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const [currentStocks, setCurrentStocks] = useState(0);
  const [purchasedStocks, setPurchasedStocks] = useState(0);
  const [soldStocks, setSoldStocks] = useState(0);
  const [profits, setProfits] = useState(0);

  // SnackBar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stocks fetched successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const [stockData, setStockData] = useState([]);

  const [pieData, setPieData] = useState([])

  const [dataChange, setDataChange] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  // --------------------------------------

  const theme = useTheme();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingData(true);

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/getAllStocks`,
          options
        );

        // console.log(data.data.length);
        setCurrentStocks(data.data.length);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    const fetchPurchasedStocks = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/getAllPurchasedStocks`,
          options
        );

        setPurchasedStocks(data.data.length);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    const fetchSoldStocks = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/getAllSoldStocks`,
          options
        );

        setSoldStocks(data.data.length);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    const fetchProfitMade = async () => {
      try {
        const soldDetails = await axios.get(
          `http://localhost:5000/api/admin/getAllSoldStocks`,
          options
        );

        const purchasedDetails = await axios.get(
          `http://localhost:5000/api/admin/getAllPurchasedStocks`,
          options
        );

        let boughtAmount = 0;
        let sellAmount = 0;

        let boughtArray = purchasedDetails.data.data;
        let soldArray = soldDetails.data.data;

        boughtArray.forEach((element, index) => {
          boughtAmount += element.amount;
        });

        soldArray.forEach((element, index) => {
          sellAmount += element.amount;
        });

        const finalProfit = Math.abs(boughtAmount - sellAmount);

        setProfits(finalProfit);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage('Couldnt fetch data!');
        setSnackOpen(true);
      }
      setLoadingData(false);
    };

    const fetchPieData = async () => {
      try {
        const responseData = await axios.get(
          `http://localhost:5000/api/admin/getAllPurchasedStocks`,
          options
        );

        const mainData = responseData.data.data.mainData;

        let result = []



      } catch (err) {}
    };

    // setLoadingData(true);

    fetchDetails().then();
    fetchPurchasedStocks().then();
    fetchSoldStocks().then();

    fetchProfitMade().then();

    // setLoadingData(false);
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Stocks Available"
              total={currentStocks}
              color="success"
              icon={'fa6-solid:box'}
              loadingData={loadingData}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Stocks Purchased"
              total={purchasedStocks}
              color="secondary"
              icon={'eva:shopping-cart-fill'}
              loadingData={loadingData}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Stocks Sold"
              total={soldStocks}
              color="secondary"
              icon={'fa6-solid:truck-ramp-box'}
              loadingData={loadingData}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Profits Made"
              total={profits}
              color="warning"
              icon={'healthicons:money-bag'}
              loadingData={loadingData}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTotalSales
              title="Total Sales"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2021',
                '02/01/2021',
                '03/01/2021',
                '04/01/2021',
                '05/01/2021',
                '06/01/2021',
                '07/01/2021',
                '08/01/2021',
                '09/01/2021',
                '10/01/2021',
                '11/01/2021',
              ]}
              chartData={[
                {
                  name: 'Stocks Purchased',
                  type: 'area',
                  fill: 'gradient',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Stocks Sold',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <CategorySales
              title="Categorie wise sales"
              chartData={[
                { label: 'Gym', value: 4344 },
                { label: 'Electronics', value: 5435 },
                { label: 'Clothing', value: 1443 },
                { label: 'Health', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
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
