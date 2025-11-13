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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Catégories', path: '/categories' },
    { label: 'Notre Menu', path: '/menu' },
    { label: 'Livraison', path: '/delivery' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
        <ListItem component={Link} to="/auth" sx={{ textDecoration: 'none' }}>
          <ListItemText primary="Connexion" />
        </ListItem>
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
            <IconButton color="primary">
              <Badge badgeContent={3} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  component={Link}
                  to="/auth"
                >
                  Connexion
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  to="/auth?tab=register"
                >
                  S'inscrire
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;