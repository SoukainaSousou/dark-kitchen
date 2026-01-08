import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { authService, cartService } from '../../services/api';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // États pour l'authentification
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mettre à jour l'utilisateur à partir du localStorage
  const updateUserFromStorage = () => {
    const userData = authService.getCurrentUser();
    console.log('Header: Updating user from storage:', userData);
    setUser(userData);
  };

  // Surveiller les changements du panier et de l'utilisateur
  useEffect(() => {
    const updateCartCount = () => {
      const totalItems = cartService.getTotalItems();
      setCartCount(totalItems);
    };

    // Mettre à jour les données initiales
    updateCartCount();
    updateUserFromStorage();

    // Écouter les événements
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('userUpdated', updateUserFromStorage);
    
    // Nettoyer les événements
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('userUpdated', updateUserFromStorage);
    };
  }, []);

  // Afficher un snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAnchorEl(null);
    showSnackbar('Déconnexion réussie', 'info');
    navigate('/');
  };

  // Gérer le menu utilisateur
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleViewOrders = () => {
    handleMenuClose();
    navigate('/myorders');
  };

  // Ouvrir la boîte de dialogue d'authentification
  const handleAuthDialogOpen = (tab = 0) => {
    setAuthTab(tab);
    setAuthError('');
    setLoginData({ email: '', password: '' });
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    });
    setAuthDialogOpen(true);
  };

  // Fermer la boîte de dialogue d'authentification
  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
    setAuthError('');
  };

  // Gérer la connexion
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    setAuthError('');
    setAuthLoading(true);
    
    if (!loginData.email || !loginData.password) {
      setAuthError('Veuillez remplir tous les champs');
      setAuthLoading(false);
      return;
    }
    
    try {
      const result = await authService.login(loginData.email, loginData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        // Mettre à jour l'état utilisateur IMMÉDIATEMENT
        const currentUser = authService.getCurrentUser();
        console.log('Current user after login:', currentUser);
        setUser(currentUser);
        
        // Fermer le dialogue
        handleAuthDialogClose();
        
        // Afficher notification
        showSnackbar('Connexion réussie !', 'success');
        
        // Rediriger selon le rôle
        if (result.user?.role === 'ADMIN') {
          navigate('/admin');
        } else if (result.user?.role === 'CHEF') {
          navigate('/chef');
        } else if (result.user?.role === 'DRIVER') {
          navigate('/driver');
        } else {
          // CLIENT - rester sur la page actuelle
          console.log('Client connecté avec succès');
        }
      } else {
        setAuthError(result.message);
      }
    } catch (err) {
      setAuthError('Erreur de connexion. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Gérer l'inscription
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    setAuthError('');
    setAuthLoading(true);
    
    // Validation
    if (!registerData.firstName || !registerData.lastName) {
      setAuthError('Le nom et prénom sont obligatoires');
      setAuthLoading(false);
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setAuthError('Les mots de passe ne correspondent pas');
      setAuthLoading(false);
      return;
    }
    
    if (registerData.password.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères');
      setAuthLoading(false);
      return;
    }
    
    try {
      const userData = {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phoneNumber: registerData.phoneNumber,
        fullName: `${registerData.firstName} ${registerData.lastName}`.trim()
      };
      
      const result = await authService.register(userData);
      console.log('Register result:', result);
      
      if (result.success) {
        // Mettre à jour l'état utilisateur IMMÉDIATEMENT
        const currentUser = authService.getCurrentUser();
        console.log('Current user after register:', currentUser);
        setUser(currentUser);
        
        // Fermer le dialogue
        handleAuthDialogClose();
        
        // Afficher notification
        showSnackbar('Inscription réussie ! Bienvenue !', 'success');
        
        // Rediriger vers l'accueil
        navigate('/');
      } else {
        setAuthError(result.message);
      }
    } catch (err) {
      setAuthError('Erreur lors de l\'inscription');
      console.error('Register error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Catégories', path: '/categories' },
    { label: 'Notre Menu', path: '/menu' },
    { label: 'Livraison', path: '/delivery' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fonction helper pour obtenir le nom d'affichage
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.fullName || user.email?.split('@')[0] || 'Utilisateur';
  };

  // Fonction helper pour obtenir l'initiale de l'avatar
  const getUserInitial = () => {
    if (!user) return '';
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // Vérifier le rôle de l'utilisateur
  const getUserRole = () => {
    if (!user) return '';
    return user.role || 'CLIENT';
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          TasteLab
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Cuisine Virtuelle d'Excellence
        </Typography>
      </Box>
      
      {/* Infos utilisateur mobile */}
      {user && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              {getUserInitial()}
            </Avatar>
            <Box sx={{ textAlign: 'left', flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {getUserDisplayName()}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email || ''}
              </Typography>
              <Chip 
                label={getUserRole()} 
                size="small" 
                color="primary"
                sx={{ mt: 0.5, fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Box>
      )}
      
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            component={Link} 
            to={item.path}
            sx={{ 
              textDecoration: 'none',
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              py: 1.5
            }}
          >
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}
        
        {/* Menu utilisateur mobile */}
        {user && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem 
              component={Link}
              to="/profile"
              sx={{ 
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { backgroundColor: 'action.hover' },
                py: 1.5
              }}
            >
              <ListItemText primary="Mon Profil" />
            </ListItem>
            <ListItem 
              component={Link}
              to="/orders"
              sx={{ 
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { backgroundColor: 'action.hover' },
                py: 1.5
              }}
            >
              <ListItemText primary="Mes Commandes" />
            </ListItem>
            
            {/* Liens selon le rôle */}
            {getUserRole() === 'ADMIN' && (
              <ListItem 
                component={Link}
                to="/admin"
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'action.hover' },
                  py: 1.5
                }}
              >
                <ListItemText primary="Administration" />
              </ListItem>
            )}
            {getUserRole() === 'CHEF' && (
              <ListItem 
                component={Link}
                to="/chef"
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'action.hover' },
                  py: 1.5
                }}
              >
                <ListItemText primary="Cuisine" />
              </ListItem>
            )}
            {getUserRole() === 'DRIVER' && (
              <ListItem 
                component={Link}
                to="/driver"
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'action.hover' },
                  py: 1.5
                }}
              >
                <ListItemText primary="Livraison" />
              </ListItem>
            )}
          </>
        )}
        
        {/* Panier mobile */}
        <ListItem 
          component={Link} 
          to="/cart"
          sx={{ 
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': { backgroundColor: 'action.hover' },
            py: 1.5,
            mt: 'auto'
          }}
        >
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <ShoppingCartIcon fontSize="small" />
                <Typography variant="body1">Panier</Typography>
                {cartCount > 0 && (
                  <Badge 
                    badgeContent={cartCount} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
          />
        </ListItem>
      </List>
      
      {/* Actions mobile */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        {user ? (
          <Button 
            fullWidth 
            variant="outlined" 
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            size="large"
          >
            Déconnexion
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => handleAuthDialogOpen(0)}
              size="large"
            >
              Connexion
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => handleAuthDialogOpen(1)}
              size="large"
              sx={{ 
                backgroundColor: '#e91e63',
                '&:hover': { backgroundColor: '#ad1457' }
              }}
            >
              S'inscrire
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Menu utilisateur desktop
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 220,
          borderRadius: 2,
          overflow: 'visible',
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {getUserDisplayName()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || ''}
        </Typography>
        <Chip 
          label={getUserRole()} 
          size="small" 
          color="primary"
          sx={{ mt: 0.5, fontSize: '0.7rem' }}
        />
      </Box>
      <Divider />
      <MenuItem onClick={handleViewProfile}>
        <PersonIcon fontSize="small" sx={{ mr: 2 }} />
        Mon Profil
      </MenuItem>
      <MenuItem onClick={handleViewOrders}>
        <HistoryIcon fontSize="small" sx={{ mr: 2 }} />
        Mes Commandes
      </MenuItem>
      
      {/* Liens selon le rôle */}
      {getUserRole() === 'ADMIN' && (
        <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
          <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
          Administration
        </MenuItem>
      )}
      {getUserRole() === 'CHEF' && (
        <MenuItem component={Link} to="/chef" onClick={handleMenuClose}>
          <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
          Cuisine
        </MenuItem>
      )}
      {getUserRole() === 'DRIVER' && (
        <MenuItem component={Link} to="/driver" onClick={handleMenuClose}>
          <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
          Livraison
        </MenuItem>
      )}
      
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
        Déconnexion
      </MenuItem>
    </Menu>
  );

  // Boîte de dialogue d'authentification
  const renderAuthDialog = () => (
    <Dialog 
      open={authDialogOpen} 
      onClose={handleAuthDialogClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {authTab === 0 ? 'Connexion à votre compte' : 'Créer un nouveau compte'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {authTab === 0 
            ? 'Entrez vos identifiants pour accéder à votre compte' 
            : 'Créez votre compte en quelques secondes'}
        </Typography>
      </DialogTitle>
      
      <Tabs 
        value={authTab} 
        onChange={(e, v) => {
          setAuthTab(v);
          setAuthError('');
        }} 
        centered
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Connexion" />
        <Tab label="Inscription" />
      </Tabs>

      <DialogContent sx={{ pt: 3 }}>
        {authTab === 0 ? (
          <form onSubmit={handleLogin}>
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                sx={{ mb: 2 }}
                autoFocus
                required
                disabled={authLoading}
              />
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                disabled={authLoading}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                Mot de passe oublié ?
              </Typography>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                  required
                  disabled={authLoading}
                  autoFocus
                />
                <TextField
                  fullWidth
                  label="Nom"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  required
                  disabled={authLoading}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                sx={{ mb: 2 }}
                required
                disabled={authLoading}
              />
              
              <TextField
                fullWidth
                label="Téléphone"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({...registerData, phoneNumber: e.target.value})}
                sx={{ mb: 2 }}
                placeholder="06 12 34 56 78"
                disabled={authLoading}
              />
              
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                sx={{ mb: 2 }}
                helperText="Minimum 6 caractères"
                required
                disabled={authLoading}
              />
              
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                required
                disabled={authLoading}
              />
            </Box>
          </form>
        )}
        
        {authError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {authError}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleAuthDialogClose} 
          color="inherit"
          disabled={authLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={authTab === 0 ? handleLogin : handleRegister}
          variant="contained"
          disabled={authLoading}
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': { backgroundColor: '#ad1457' }
          }}
        >
          {authLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : authTab === 0 ? (
            'Se connecter'
          ) : (
            'Créer mon compte'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 2 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <RestaurantIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32, display: { xs: 'none', sm: 'block' } }} />
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontFamily: '"Pacifico", cursive',
                }}
              >
                TasteLab
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 2, 
                  color: 'text.secondary', 
                  fontStyle: 'italic', 
                  display: { xs: 'none', md: 'block' } 
                }}
              >
                Cuisine Virtuelle d'Excellence
              </Typography>
            </Box>

            {/* Navigation Desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                      px: 2
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Panier */}
              <IconButton 
                color="primary"
                component={Link}
                to="/cart"
                sx={{ 
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                <Badge 
                  badgeContent={cartCount} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
              {!isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user ? (
                    <>
                      <Chip
                        avatar={
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main',
                              width: 28,
                              height: 28
                            }}
                          >
                            {getUserInitial()}
                          </Avatar>
                        }
                        label={getUserDisplayName()}
                        variant="outlined"
                        onClick={handleMenuOpen}
                        sx={{
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white'
                          }
                        }}
                      />
                      {userMenu}
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => handleAuthDialogOpen(0)}
                        sx={{ 
                          borderRadius: 2,
                          px: 3
                        }}
                      >
                        Connexion
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={() => handleAuthDialogOpen(1)}
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          backgroundColor: '#e91e63',
                          '&:hover': {
                            backgroundColor: '#ad1457'
                          }
                        }}
                      >
                        S'inscrire
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Drawer Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>

      {/* Boîte de dialogue d'authentification */}
      {renderAuthDialog()}

      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;