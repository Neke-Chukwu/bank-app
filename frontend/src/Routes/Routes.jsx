// src/Routes/Routes.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Home from '../Public Pages/Home';
import Services from '../Public Pages/Services';
import About from '../Public Pages/About';
import Contact from '../Public Pages/Contact';
import Login from '../Public Pages/LogIn';
import Register from '../Public Pages/Register';
import Profile from '../User Pages/PersonalInfoPage';
import DashboardLayout from '../Layouts/DashboardLayout';
import DashboardHome from '../User Pages/DashboardHome';
import LocalTransfer from '../User Pages/LocalTransfer';
import InternationalTransfer from '../User Pages/InternationalTransfer';
import Deposit from '../User Pages/Deposit';
import PayBills from '../User Pages/BillPayment';
import Loans from '../User Pages/LoanPage';
import Savings from '../User Pages/Savings';
import Investments from '../User Pages/Investment';
import Transactions from '../User Pages/Transactions';
import ProfilePage from '../User Pages/Profile';
import Cards from '../User Pages/Cards';
import PasswordReset from '../User Pages/PasswordReset';
import AdminLayout from '../Layouts/AdminLayout';
import AdminHome from '../Admin Pages/AdminHome';
import ManageUsers from '../Admin Pages/ManageUsers';
import AuthProtect from './AuthProtect';
import ScrollToTop from '../Components/ScrollToTop';
import NotFound from "../Public Pages/NotFound";

const AppRoutes = () => {
  const location = useLocation();
  const hideNav =
    location.pathname.startsWith('/user') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/personal-info';

  return (
    <>
      {!hideNav && <Navbar />}
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/personal-info" element={<Profile />} />

        {/* User-only */}
        <Route
          path="/user/*"
          element={
            <AuthProtect allowedRoles={['user']}>
              <DashboardLayout />
            </AuthProtect>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="local-transfer" element={<LocalTransfer />} />
          <Route path="international-transfer" element={<InternationalTransfer />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="pay-bills" element={<PayBills />} />
          <Route path="loans" element={<Loans />} />
          <Route path="savings" element={<Savings />} />
          <Route path="investments" element={<Investments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cards" element={<Cards />} />
          <Route path="password-reset" element={<PasswordReset />} />
        </Route>

        {/* Admin-only */}
        <Route
          path="/admin/*"
          element={
            <AuthProtect allowedRoles={['admin']}>
              <AdminLayout />
            </AuthProtect>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="manage-users/:id" element={<ManageUsers />} />
        </Route>

        {/* 404 Not Found Page */}
      <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <Footer />}
    </>
  );
};

export default AppRoutes;
