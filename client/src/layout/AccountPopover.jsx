import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';
// components
import MenuPopover from '../components/MenuPopover';
// mocks_
import account from '../_mock/account';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../store/authStore';
import Cookies from 'js-cookie';
import axios from 'axios';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Stats',
    icon: 'eva:person-fill',
    linkTo: '/dashboard/app',
  },
  {
    label: 'Profile',
    icon: 'eva:settings-2-fill',
    linkTo: '/dashboard/profile',
  },
];

// ----------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AccountPopover() {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    credentials: 'include',
  };

  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const userDetails = JSON.parse(Cookies.get('user'));

  const authDispatcher = useDispatch();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = async () => {
    setOpen(null);
    await sleep(500);
    // authDispatcher(removeAuth());
    // alert('Logging out!');
    // navigate('/login', { replace: true });
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/admin/logoutAdmin`,
        options
      );
    } catch (err) {
      console.log(err.response.data);
    }
    setOpen(null);
    authDispatcher(removeAuth());
    Cookies.remove('user');
    Cookies.remove('auth');

    await sleep(500);
    // alert('Logging out!');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userDetails.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userDetails.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
