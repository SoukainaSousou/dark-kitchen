import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Cart from './pages/Cart';
import AdminOrders from "./admin/AdminOrders";
import AdminMenu from "./admin/AdminMenu";
import AdminCategories from "./admin/AdminCategories";
import AdminUsers from "./admin/AdminUsers";
import AdminClients from "./admin/AdminClients";
import AdminProfil from "./admin/AdminProfil";

import AdminKitchen from "./admin/AdminKitchen";
import AdminDelivery from "./admin/AdminDelivery";

import ChefLayout from "./cuisinier/ChefLayout";
import ChefDashboard from "./cuisinier/ChefDashboard";
import ChefReadyOrders from './cuisinier/ChefReadyOrders';

import ChefProfil from './cuisinier/ChefProfil';

import DriverLayout from "./livreur/DriverLayout";
import DriverDashboard from "./livreur/DriverDashboard";

import ChefOrders from './cuisinier/ChefOrders';
import DeliveryOrders from './livreur/DeliveryOrders';
import DriverCompleted from './livreur/DriverCompleted';

import DriverProfil from './livreur/DriverProfil';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import { authService } from './services/api';

// Composant de protection des routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

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
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="menu" element={<Menu />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="cart" element={<Cart />} />
            <Route path="auth" element={<Auth />} />
            
            {/* Routes protégées pour clients */}
            <Route path="profile" element={ <Profile /> } />
            <Route path="orders" element={<Orders /> } />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={ <OrderDetails />  } />
          </Route>

          {/* Routes admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="profil" element={<AdminProfil />} />
            
            <Route path="kitchen" element={<AdminKitchen />} />
            <Route path="delivery" element={<AdminDelivery />} />
          </Route>

            {/* Routes cuisinier */}
          <Route 
            path="/chef" 
            element={
              <ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>
                <ChefLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ChefDashboard />} />
            <Route path="orders" element={<ChefOrders />} />
            <Route path="ready" element={<ChefReadyOrders/>} />
            <Route path="profil" element={<ChefProfil/>} />
          </Route>

          {/* Routes livreur */}
          <Route 
            path="/driver" 
            element={
              <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                <DriverLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DriverDashboard />} />
            <Route path="orders" element={<DeliveryOrders />} />
            <Route path="completed" element={<DriverCompleted />} />
            <Route path="profil" element={<DriverProfil />} />
          </Route>
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;