import React from 'react';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLogin = () => {
  let user = Cookies.get('user');

  let isLogged = false;

  if (user) {
    isLogged = true;
  }

  return isLogged ? <Navigate to={'/dashboard/app'} /> : <Outlet />
};

export default ProtectedLogin;
