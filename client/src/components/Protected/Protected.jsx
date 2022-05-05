import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

export const Protected = () => {
  const userDetails = Cookies.get('user');

  const isAuth = userDetails ? true : false;

  return isAuth ? <Outlet /> : <Navigate to={'/login'} />;
};
