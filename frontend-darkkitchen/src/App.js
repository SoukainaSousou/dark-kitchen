// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Menu from './pages/Menu';
import Delivery from './pages/Delivery';
import Auth from './pages/Auth';
import PublicLayout from './pages/PublicLayout';
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminMenu from "./admin/AdminMenu";
import AdminCategories from "./admin/AdminCategories";
import AdminUsers from "./admin/AdminUsers";
import AdminKitchen from "./admin/AdminKitchen";
import AdminDelivery from "./admin/AdminDelivery";
import ChefLayout from "./cuisinier/ChefLayout";
import ChefDashboard from "./cuisinier/ChefDashboard";
import DriverLayout from "./livreur/DriverLayout";
import DriverDashboard from "./livreur/DriverDashboard";

// NOUVEAUX IMPORTATIONS
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import DishDetail from './pages/DishDetail';
import Profile from './pages/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
      light: '#f48fb1',
      dark: '#ad1457',
    },
    secondary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="menu" element={<Menu />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="auth" element={<Auth />} />
            
            {/* NOUVELLES ROUTES CLIENT */}
           
            <Route path="cart" element={<Cart />} />
            <Route path="dish/:id" element={<DishDetail />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:orderNumber" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="kitchen" element={<AdminKitchen />} />
            <Route path="delivery" element={<AdminDelivery />} />
          </Route>

          <Route path="/chef" element={<ChefLayout />}>
            <Route index element={<ChefDashboard />} />
          </Route>

          <Route path="/driver" element={<DriverLayout />}>
            <Route index element={<DriverDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;