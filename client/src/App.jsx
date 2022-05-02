// import logo from './logo.svg';
// import './App.css';
// import { useState } from 'react';
import {
  Routes,
  Route,
  // Link,
  // useNavigate,
  // useLocation,
  Navigate,
  // Outlet,
} from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { SidePanel } from './components/SidePanel';
// import { addUser } from './store/store';
import Home from './components/Home/Home';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { DashboardApp } from './pages/DashboardApp';
import { Bill } from './pages/Bill';
import { Profile } from './pages/Profile';
import { Stocks } from './pages/Stocks';
import { Receipt } from './pages/Receipt';
import { SoldStocks } from './pages/SoldStocks';
import { NotFound } from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

import ThemeProvider from './theme';
import { Protected } from './components/Protected/Protected';
import { PurchasedStocks } from './pages/PurchasedStocks';
import { CreateStock } from './pages/CreateStock';

function App() {
  // const userDispatcher = useDispatch();

  // const userData = useSelector((state) => state.user.value);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route exact path="login" element={<Login />} />
          <Route exact path="register" element={<Register />} />
        </Route>
        <Route element={<Protected />}>
          <Route exact path="/dashboard" element={<DashboardLayout />}>
            <Route exact index path="app" element={<DashboardApp />} />
            <Route exact path="stocks" element={<Stocks />} />
            <Route exact path="createstock" element={<CreateStock />} />
            <Route exact path="purchasedstocks" element={<PurchasedStocks />} />
            <Route exact path="soldstocks" element={<SoldStocks />} />
            <Route exact path="receipts" element={<Receipt />} />
            <Route exact path="bills" element={<Bill />} />
            <Route exact path="profile" element={<Profile />} />
            <Route path={'*'} element={<Navigate to="/404" />} />
          </Route>
        </Route>
        <Route path={'404'} element={<NotFound />} />
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
