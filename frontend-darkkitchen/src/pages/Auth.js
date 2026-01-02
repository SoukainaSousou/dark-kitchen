// src/pages/Auth.js (version adaptée pour les deux systèmes)
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AuthService from '../services/AuthService';

const Auth = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userType, setUserType] = useState('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '',
    userType: 'client' 
  });
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Initialiser depuis l'URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'admin') {
      setUserType('admin');
      setLoginData(prev => ({ ...prev, userType: 'admin' }));
    }
    setError('');
    setSuccess('');
  }, [searchParams]);

  // ==================== LOGIN ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      let result;
      
      if (loginData.userType === 'admin') {
        // Login ADMIN
        result = await AuthService.loginAdmin(loginData.email, loginData.password);
        setSuccess('Connexion admin réussie !');
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        // Login CLIENT
        result = await AuthService.loginClient(loginData.email, loginData.password);
        setSuccess('Connexion réussie !');
        setTimeout(() => navigate('/'), 1000);
      }

    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }
    
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.phoneNumber) {
      setError('Les champs obligatoires sont requis');
      setLoading(false);
      return;
    }

    try {
      // Inscription CLIENT
      const userData = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber,
        address: registerData.address || '',
        city: registerData.city || '',
        postalCode: registerData.postalCode || ''
      };

      await AuthService.registerClient(userData);
      setSuccess('Inscription réussie ! Vous êtes maintenant connecté.');
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setLoginData(prev => ({ ...prev, userType: type }));
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        {/* Sélecteur de type */}
        {tabValue === 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom align="center" color="primary">
              Vous êtes ?
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant={userType === 'client' ? 'contained' : 'outlined'}
                  onClick={() => handleUserTypeChange('client')}
                  startIcon={<PersonIcon />}
                  sx={{ py: 2 }}
                >
                  Client
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant={userType === 'admin' ? 'contained' : 'outlined'}
                  onClick={() => handleUserTypeChange('admin')}
                  startIcon={<BusinessIcon />}
                  sx={{ py: 2 }}
                >
                  Personnel
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Typography variant="h4" textAlign="center" gutterBottom color="primary" fontWeight="bold">
          {tabValue === 0 
            ? `Connexion ${userType === 'client' ? 'Client' : 'Personnel'}`
            : 'Inscription Client'}
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={(e, val) => {
            setTabValue(val);
            setError('');
            setSuccess('');
          }} 
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Connexion" />
          <Tab label="Inscription" disabled={userType === 'admin'} />
        </Tabs>
        
        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        
        {/* Formulaires */}
        {tabValue === 0 ? (
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
              />
              <TextField
                label="Mot de passe"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ mt: 2, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Se connecter en tant que ${userType === 'client' ? 'Client' : 'Personnel'}`
                )}
              </Button>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prénom *"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom *"
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Téléphone *"
                  name="phoneNumber"
                  value={registerData.phoneNumber}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Code postal"
                  name="postalCode"
                  value={registerData.postalCode}
                  onChange={handleRegisterChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Adresse"
                  name="address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Ville"
                  name="city"
                  value={registerData.city}
                  onChange={handleRegisterChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mot de passe *"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  helperText="Minimum 6 caractères"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirmer le mot de passe *"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Créer mon compte client'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Auth;