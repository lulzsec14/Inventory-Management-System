import { Routes, Route, Navigate } from 'react-router-dom';
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
import Home from './components/Home/Home';
import ThemeProvider from './theme';
import { Protected } from './components/Protected/Protected';
import { PurchasedStocks } from './pages/PurchasedStocks';
import { CreateStock } from './pages/CreateStock';
import { CreateCats } from './pages/CreateCats';
import ProtectedLogin from './components/Protected/ProtectedLogin';

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route element={<ProtectedLogin />}>
          <Route exact path="login" element={<Login />} />
          <Route exact path="register" element={<Register />} />
        </Route>
        <Route element={<Protected />}>
          <Route exact path="/dashboard" element={<DashboardLayout />}>
            <Route exact path="app" element={<DashboardApp />} />
            <Route exact path="stocks" element={<Stocks />} />
            <Route exact path="createstock" element={<CreateStock />} />
            <Route exact path="createCategory" element={<CreateCats />} />
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
