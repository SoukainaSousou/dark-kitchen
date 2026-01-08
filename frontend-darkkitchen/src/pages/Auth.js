// src/pages/Auth.js - Version finale avec séparation Clients/Staff
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
  CircularProgress,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { authService } from '../services/api';

const Auth = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userType, setUserType] = useState('CLIENT'); // CLIENT, STAFF
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Données de connexion
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: ''
  });
  
  // Données d'inscription (uniquement pour clients)
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
    
    if (type === 'staff' || type === 'admin') {
      setUserType('STAFF');
      setTabValue(0); // Forcer l'onglet connexion pour staff
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
      // Validation
      if (!loginData.email || !loginData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      console.log(`Login attempt: ${loginData.email} as ${userType}`);
      
      // Appel au service d'authentification
      const result = await authService.login(loginData.email, loginData.password, userType);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      const user = result.user;
      console.log('Login successful:', user);
      
      // Rediriger selon le rôle avec délai pour voir le message
      setSuccess(`Connexion ${userType === 'CLIENT' ? 'client' : user.role?.toLowerCase()} réussie !`);
      
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'CHEF') {
          navigate('/chef/kitchen');
        } else if (user.role === 'DRIVER') {
          navigate('/driver/deliveries');
        } else {
          // CLIENT
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER (CLIENT ONLY) ====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      if (registerData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
        throw new Error('Les champs obligatoires (*) sont requis');
      }

      // Inscription CLIENT seulement
      const userData = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber || '',
        address: registerData.address || '',
        city: registerData.city || '',
        postalCode: registerData.postalCode || ''
      };

      const result = await authService.register(userData);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess('Inscription réussie ! Vous êtes maintenant connecté.');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setError('');
    setSuccess('');
    if (type === 'STAFF') {
      setTabValue(0); // Forcer l'onglet connexion pour staff
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  // Comptes de démonstration
  const fillDemoAccount = (type, account) => {
    setUserType(type);
    setLoginData({
      email: account.email,
      password: account.password
    });
    setSuccess(`Compte ${account.role} pré-rempli : ${account.description}`);
  };

  const demoAccounts = [
    { 
      type: 'CLIENT', 
      email: 'client@test.com', 
      password: 'client123', 
      description: 'Compte client de test',
      role: 'Client'
    },
    { 
      type: 'STAFF', 
      email: 'admin@darkkitchen.com', 
      password: 'admin123', 
      description: 'Administrateur système',
      role: 'Admin'
    },
    { 
      type: 'STAFF', 
      email: 'chef@darkkitchen.com', 
      password: 'chef123', 
      description: 'Chef cuisinier',
      role: 'Chef'
    },
    { 
      type: 'STAFF', 
      email: 'driver@darkkitchen.com', 
      password: 'driver123', 
      description: 'Livreur',
      role: 'Driver'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Zone de sélection et informations */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%', bgcolor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
              <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Type de compte
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sélectionnez votre type de compte :
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Bouton Client */}
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: userType === 'CLIENT' ? '#e91e63' : 'transparent',
                    bgcolor: userType === 'CLIENT' ? 'rgba(233, 30, 99, 0.08)' : 'white',
                    '&:hover': { borderColor: '#e91e63' }
                  }}
                  onClick={() => handleUserTypeChange('CLIENT')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 2, color: '#e91e63' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Client
                      </Typography>
                      {userType === 'CLIENT' && (
                        <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      • Commander des plats<br/>
                      • Suivre mes commandes<br/>
                      • Gérer mon profil<br/>
                      • Historique des achats
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Bouton Staff */}
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: userType === 'STAFF' ? '#1976d2' : 'transparent',
                    bgcolor: userType === 'STAFF' ? 'rgba(25, 118, 210, 0.08)' : 'white',
                    '&:hover': { borderColor: '#1976d2' }
                  }}
                  onClick={() => handleUserTypeChange('STAFF')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 2, color: '#1976d2' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Personnel
                      </Typography>
                      {userType === 'STAFF' && (
                        <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      • Administration système<br/>
                      • Gestion des commandes<br/>
                      • Préparation des plats<br/>
                      • Livraison
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Informations */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations importantes
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Clients" 
                    secondary="Inscription gratuite, commandes en ligne" 
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <BusinessIcon fontSize="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Personnel" 
                    secondary="Comptes créés par l'administrateur" 
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Formulaire principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            {/* En-tête */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {userType === 'CLIENT' ? (
                <>
                  <PersonIcon sx={{ fontSize: 40, color: '#e91e63', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#e91e63">
                      Espace Client
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Connectez-vous ou créez votre compte
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <BusinessIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      Espace Personnel
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Accès réservé au staff
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
            
            {/* Tabs (Inscription désactivée pour staff) */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, val) => {
                  setTabValue(val);
                  setError('');
                  setSuccess('');
                }}
                sx={{ 
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }
                }}
              >
                <Tab 
                  label="Connexion" 
                  sx={{ 
                    color: tabValue === 0 ? (userType === 'CLIENT' ? '#e91e63' : '#1976d2') : 'inherit'
                  }}
                />
                <Tab 
                  label="Inscription" 
                  disabled={userType === 'STAFF'}
                  sx={{ 
                    color: tabValue === 1 ? '#e91e63' : 'inherit',
                    opacity: userType === 'STAFF' ? 0.5 : 1
                  }}
                />
              </Tabs>
            </Box>
            
            {/* Messages */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setError('')}
              >
                <Typography fontWeight="bold">{error}</Typography>
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setSuccess('')}
              >
                <Typography fontWeight="bold">{success}</Typography>
              </Alert>
            )}
            
            {/* Formulaire de CONNEXION */}
            {tabValue === 0 && (
              <Box>
                <form onSubmit={handleLogin}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        placeholder="exemple@email.com"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        placeholder="••••••••"
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        disabled={loading}
                        fullWidth
                        sx={{ 
                          mt: 1, 
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          bgcolor: userType === 'CLIENT' ? '#e91e63' : '#1976d2',
                          '&:hover': {
                            bgcolor: userType === 'CLIENT' ? '#ad1457' : '#1565c0'
                          }
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          `Se connecter ${userType === 'CLIENT' ? 'en tant que Client' : 'en tant que Personnel'}`
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
                
                {/* Comptes de démo */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                    Comptes de démonstration :
                  </Typography>
                  <Grid container spacing={1}>
                    {demoAccounts
                      .filter(account => userType === 'STAFF' ? account.type === 'STAFF' : account.type === 'CLIENT')
                      .map((account, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card 
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { 
                                bgcolor: 'action.hover',
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s'
                              }
                            }}
                            onClick={() => fillDemoAccount(account.type, account)}
                          >
                            <CardContent sx={{ py: 2, px: 3 }}>
                              <Typography variant="body2" fontWeight="bold" noWrap>
                                {account.email}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {account.description}
                              </Typography>
                              <Chip 
                                label={account.role}
                                size="small"
                                color={account.type === 'CLIENT' ? 'primary' : 'secondary'}
                                sx={{ mt: 1, fontSize: '0.7rem' }}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              </Box>
            )}
            
            {/* Formulaire d'INSCRIPTION (CLIENT ONLY) */}
            {tabValue === 1 && userType === 'CLIENT' && (
              <Box>
                <form onSubmit={handleRegister}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prénom *"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        placeholder="Jean"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom *"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        placeholder="Dupont"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email *"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        placeholder="jean.dupont@email.com"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        name="phoneNumber"
                        value={registerData.phoneNumber}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        variant="outlined"
                        placeholder="06 12 34 56 78"
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Adresse"
                        name="address"
                        value={registerData.address}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        variant="outlined"
                        multiline
                        rows={2}
                        placeholder="123 Rue de la Paix"
                        InputProps={{
                          startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ville"
                        name="city"
                        value={registerData.city}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        variant="outlined"
                        placeholder="Paris"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Code postal"
                        name="postalCode"
                        value={registerData.postalCode}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        variant="outlined"
                        placeholder="75001"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mot de passe *"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        helperText="Minimum 6 caractères"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirmer le mot de passe *"
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        disabled={loading}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        disabled={loading}
                        fullWidth
                        sx={{ 
                          mt: 2, 
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          bgcolor: '#e91e63',
                          '&:hover': { bgcolor: '#ad1457' }
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Créer mon compte client'
                        )}
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                        En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
            
            {/* Message pour staff - Inscription non disponible */}
            {tabValue === 1 && userType === 'STAFF' && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  Inscription non disponible pour le personnel
                </Typography>
                <Typography variant="body2">
                  Les comptes administrateur, cuisinier et livreur sont créés par l'administrateur système.
                  Si vous avez besoin d'un accès, contactez votre administrateur.
                </Typography>
              </Alert>
            )}
            
            {/* Divider et lien de retour */}
            <Divider sx={{ my: 4 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/')}
                sx={{ borderRadius: 2 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Auth;