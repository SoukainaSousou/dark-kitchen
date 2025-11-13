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

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Rose moderne
      light: '#f48fb1',
      dark: '#ad1457',
    },
    secondary: {
      main: '#4caf50', // Vert frais
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
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;