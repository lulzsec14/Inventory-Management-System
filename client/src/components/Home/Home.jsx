import { Outlet, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../Logo';
import React, { Fragment, useEffect } from 'react';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const navigate = useNavigate();

  let user = Cookies.get('user');
  useEffect(() => {
    navigate('/login', { replace: true });
  }, []);

  return (
    <Fragment>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      <Outlet />
    </Fragment>
  );
}
