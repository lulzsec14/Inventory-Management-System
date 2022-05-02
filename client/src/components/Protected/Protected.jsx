import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Protected = () => {
  const isAuth = useSelector((state) => state.auth.value);

  return isAuth ? <Outlet /> : <Navigate to={'/login'} />;
};
