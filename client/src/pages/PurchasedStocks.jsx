import { format } from 'date-fns';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import {
  StockListHead,
  StockListToolbar,
  // StockMoreMenu,
} from '../sections/dashboard/stock';
// mock
import USERLIST from '../_mock/user';
import axios from 'axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'seller', label: 'Seller', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
];

// const AVATAR_URL = `/static/mock-images/avatars/avatar_${index + 1}.jpg`
// ----------------------------------------------------------------------

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

export const PurchasedStocks = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // SnackBar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stocks fetched successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const [stockData, setStockData] = useState([]);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  // --------------------------------------

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/getAllPurchasedStocks',
          options
        );
        // console.log(data.data);

        const responsedata = data.data;
        // console.log(responsedata);
        const finalData = [];

        responsedata.forEach((element, index) => {
          const temp = {};
          temp.name = element.name;
          temp.id = element._id;
          temp.date = new Date(element.datePurchased);
          temp.amount = element.amount;
          temp.quantity = element.quantity;
          temp.seller = element.seller.name;
          temp.category = element.category.name;
          temp.avatarUrl = `/static/mock-images/avatars/box.png`;

          finalData.push(temp);
        });

        // console.log(finalData);
        setStockData(finalData);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    fetchStocks().then();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = stockData.map((n) => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stockData.length) : 0;

  const filteredUsers = applySortFilter(
    stockData,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  // console.log(stockData);
  // console.log(stockData);

  return (
    <Page title="Stocks">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Sold Stocks
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/createstock"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add Stock
          </Button> */}
        </Stack>

        <Card>
          <StockListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <StockListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={stockData.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      name,
                      category,
                      seller,
                      avatarUrl,
                      quantity,
                      amount,
                      date,
                    } = row;

                    // console.log(format(Date.now(), 'dd/MM/yyyy'));
                    const dateAdded = format(date, 'dd/MM/yyyy');

                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
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
                        <TableCell align="left">{seller}</TableCell>
                        <TableCell align="left">{category}</TableCell>
                        <TableCell align="left">{dateAdded}</TableCell>
                        <TableCell align="left">{amount}</TableCell>
                        <TableCell align="left">{quantity}</TableCell>

                        {/* <TableCell align="right">
                          <StockMoreMenu refId={id} />
                        </TableCell> */}
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
            count={stockData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
