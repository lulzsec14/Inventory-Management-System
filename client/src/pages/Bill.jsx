import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { BillCard, BillSort, BillSearch } from '../sections/dashboard/bill';
// mock
import POSTS from '../_mock/blog';
import BILLS from '../_mock/bills';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export const Bill = () => {
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
            Bills
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Post
          </Button> */}
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

        {/* <ScrollBar> */}
        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BillCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
        {/* </ScrollBar> */}
      </Container>
    </Page>
  );
};
