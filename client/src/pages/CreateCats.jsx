import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
import { format } from 'date-fns';

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
  Backdrop,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  TableContainer,
  TablePagination,
  Alert,
  Checkbox,
  Modal,
  Fade,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';

import { LoadingButton } from '@mui/lab';
import axios from 'axios';

import SearchNotFound from '../components/SearchNotFound';

import {
  StockListHead,
  StockListToolbar,
  StockMoreMenu,
} from '../sections/dashboard/stock';
import CategoryMoreMenu from '../sections/dashboard/category/CategoryMoreMenu';

const TABLE_HEAD = [
  { id: 'index', label: 'SNo.', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
];

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65%',
  // padding: '44px',
  // height: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export const CreateCats = () => {
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const avatarUrl = `/static/mock-images/avatars/box.png`;

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [categoryData, setCategoryData] = useState([]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stock created successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const [dataChanged, setDataChanged] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  // --------------------------------------

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
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/getAllCats',
          options
        );

        const responseData = data.data;

        let finalData = [];

        responseData.forEach((element, index) => {
          const temp = {};
          temp.index = index + 1;
          temp.name = element.name;
          temp.id = element._id;

          finalData.push(temp);
        });

        // console.log(responseData);
        setCategoryData(finalData);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    fetchCats().then();
  }, [dataChanged]);

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

  // Editing Category

  const categoryValidate = Yup.object().shape({
    catName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
  });

  const CatFormik = useFormik({
    initialValues: {
      id: '',
      catName: '',
    },
    validationSchema: categoryValidate,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      // console.log('Hi');

      try {
        // alert(JSON.stringify(values, null, 2));
        // console.log('Here');
        const { data } = await axios.put(
          'http://localhost:5000/api/admin/updateCategory',
          {
            data: {
              id: values.id,
              dataToUpdate: {
                name: values.catName,
              },
            },
          },
          options
        );

        setSnackColor('success');
        setSnackMessage(data.message);
        setSnackOpen(true);
        handleModalClose();

        setDataChanged((prev) => !prev);
        // navigate('/dashboard/stocks', { replace: true });
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error || 'Some error occured!');
        setSnackOpen(true);
      }

      // alert(JSON.stringify(values, null, 2));
    },
  });

  const CatErrors = CatFormik.errors;
  const CatTouched = CatFormik.touched;
  const CatHandleSubmit = CatFormik.handleSubmit;
  const CatIsSubmitting = CatFormik.isSubmitting;
  const CatGetFieldProps = CatFormik.getFieldProps;

  // useEffect(() => {}, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categoryData.map((n) => {
        console.log(n.id);
        return n.name;
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    // console.log(selected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryData.length) : 0;

  const filteredUsers = applySortFilter(
    categoryData,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  // ----------------------

  return (
    <Page title="Create Category">
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

        {/* Additional  */}

        <Card style={{ marginTop: '13px' }}>
          <TableContainer>
            <Table>
              <StockListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={categoryData.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const { name, id } = row;

                    // console.log(format(Date.now(), 'dd/MM/yyyy'));

                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={index}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, name)}
                          />
                        </TableCell>
                        <TableCell align="left">{index + 1}</TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* <TableCell align="left">{seller}</TableCell>
                        <TableCell align="left">{category}</TableCell>
                        <TableCell align="left">{dateAdded}</TableCell>
                        <TableCell align="left">{amount}</TableCell>
                        <TableCell align="left">{quantity}</TableCell> */}

                        <TableCell align="right">
                          <CategoryMoreMenu
                            refId={id}
                            CatFormik={CatFormik}
                            handleModalOpen={handleModalOpen}
                            handleModalClose={handleModalClose}
                            setSnackColor={setSnackColor}
                            setSnackMessage={setSnackMessage}
                            setSnackOpen={setSnackOpen}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categoryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <RootStyle>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalOpen}>
            <Box sx={modalStyle}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Sell Stock
              </Typography>
              <Container sx={{ marginTop: '13px' }}>
                <FormikProvider value={CatFormik}>
                  <Form
                    autoComplete="off"
                    noValidate
                    onSubmit={CatHandleSubmit}
                  >
                    <Stack spacing={3}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <TextField
                          fullWidth
                          label="Category Id"
                          disabled
                          {...CatGetFieldProps('id')}
                          error={Boolean(CatTouched.id && CatErrors.id)}
                          helperText={CatTouched.id && CatErrors.id}
                        />

                        <TextField
                          fullWidth
                          label="Update category name"
                          {...CatGetFieldProps('catName')}
                          error={Boolean(
                            CatTouched.catName && CatErrors.catName
                          )}
                          helperText={CatTouched.catName && CatErrors.catName}
                        />
                      </Stack>

                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={CatIsSubmitting}
                      >
                        Update Category Name
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </Container>
            </Box>
          </Fade>
        </Modal>
      </RootStyle>

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
