import React from 'react';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { AppWidgetSummary } from '../sections/dashboard/app';
import { AppTotalSales } from '../sections/dashboard/app';
import CategorySales from '../sections/dashboard/app/CategorySales';

export const DashboardApp = () => {
  const theme = useTheme();

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
              total={714000}
              color="success"
              icon={'fa6-solid:box'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Stocks Purchased"
              total={1352831}
              color="secondary"
              icon={'eva:shopping-cart-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Stocks Sold"
              total={1723315}
              color="secondary"
              icon={'fa6-solid:truck-ramp-box'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Profit Made"
              total={234}
              color="warning"
              icon={'healthicons:money-bag'}
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
    </Page>
  );
};
