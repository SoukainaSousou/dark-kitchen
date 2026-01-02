// src/components/common/Header.js
import React, { useState } from 'react';
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
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AuthService from '../../services/AuthService';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAuthenticated = AuthService.isAuthenticated();
  const isClient = AuthService.isClient();
  const isAdmin = AuthService.isAdmin();
  const currentUser = AuthService.getCurrentUser();

  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Catégories', path: '/categories' },
    { label: 'Notre Menu', path: '/menu' },
    { label: 'Livraison', path: '/delivery' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    handleMenuClose();
    navigate('/');
  };

  const handleMyOrders = () => {
    handleMenuClose();
    navigate('/my-orders');
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/admin/dashboard');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        <RestaurantIcon sx={{ mr: 1 }} />
        TasteLab
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            component={Link} 
            to={item.path}
            sx={{ 
              textDecoration: 'none',
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        {isAuthenticated ? (
          <>
            {isClient && (
              <ListItem 
                component={Link} 
                to="/my-orders"
                sx={{ textDecoration: 'none', color: 'text.primary' }}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Mes Commandes" />
              </ListItem>
            )}
            {isAdmin && (
              <ListItem 
                component={Link} 
                to="/admin/dashboard"
                sx={{ textDecoration: 'none', color: 'text.primary' }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Tableau de bord" />
              </ListItem>
            )}
            <Divider sx={{ my: 1 }} />
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={Link} to="/auth" sx={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Connexion Client" />
            </ListItem>
            <ListItem component={Link} to="/auth?type=admin" sx={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Connexion Personnel" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
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
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary', fontStyle: 'italic' }}>
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
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Panier (seulement pour les clients) */}
           
            
            {/* Authentification */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 36,
                      height: 36,
                      fontSize: 16
                    }}
                  >
                    {currentUser?.firstName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {isClient ? `${currentUser?.firstName} ${currentUser?.lastName}` : currentUser?.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isClient ? 'Client' : 'Personnel'}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  
                  {isClient && (
                    <MenuItem onClick={handleMyOrders}>
                      <ListItemIcon>
                        <HistoryIcon fontSize="small" />
                      </ListItemIcon>
                      Mes Commandes
                    </MenuItem>
                  )}
                  
                  {isAdmin && (
                    <MenuItem onClick={handleDashboard}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Tableau de bord
                    </MenuItem>
                  )}
                  
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                      <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    Déconnexion
                  </MenuItem>
                </Menu>
              </Box>
            ) : !isMobile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  component={Link}
                  to="/auth"
                >
                  Connexion Client
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  to="/auth?type=admin"
                >
                  Personnel
                </Button>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;