// src/pages/Auth.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data || 'Erreur de connexion');
      }
      
      // Stocker les infos utilisateur
      localStorage.setItem('user', JSON.stringify(data));
      
      // Rediriger selon le rôle
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    try {
      const userData = {
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName,
        phoneNumber: registerData.phoneNumber
      };
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data || 'Erreur d\'inscription');
      }
      
      // Stocker et rediriger
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          {tabValue === 0 ? 'Connexion' : 'Inscription'}
        </Typography>
        
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {tabValue === 0 ? (
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nom complet"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
                fullWidth
              />
              <TextField
                label="Téléphone"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({...registerData, phoneNumber: e.target.value})}
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
                fullWidth
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Auth;