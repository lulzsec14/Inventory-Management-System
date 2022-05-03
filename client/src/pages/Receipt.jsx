import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { BillCard, BillSort, BillSearch } from '../sections/dashboard/bill';
// mock
import POSTS from '../_mock/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export const Receipt = () => {
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
          <BillSearch posts={POSTS} />
          <BillSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BillCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
};
