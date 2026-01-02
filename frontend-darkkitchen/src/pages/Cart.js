// src/pages/Cart.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  Divider,
  Alert,
  TextField
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AuthService from '../services/AuthService';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      dish: {
        id: 1,
        name: 'Pizza Margherita',
        description: 'Tomate, mozzarella, basilic',
        price: 12.50,
        image: '/images/pizza.jpg'
      },
      quantity: 2,
      specialRequest: ''
    }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.dish.price * item.quantity), 0
    );
  };

  const deliveryFee = 2.50;
  const total = getSubtotal() + deliveryFee;

  const handleCheckout = () => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Votre panier est vide
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Ajoutez des plats délicieux à votre panier pour commencer vos achats.
          </Typography>
          <Button component={Link} to="/menu" variant="contained" size="large">
            Explorer le menu
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Votre Panier
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {cartItems.map((item) => (
              <Box key={item.id}>
                <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                  <Grid item xs={3}>
                    <Box
                      component="img"
                      src={item.dish.image || '/default-dish.jpg'}
                      alt={item.dish.name}
                      sx={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={5}>
                    <Typography variant="h6" gutterBottom>
                      {item.dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.dish.description}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2} textAlign="right">
                    <Typography variant="h6" color="primary.main">
                      {(item.dish.price * item.quantity).toFixed(2)}€
                    </Typography>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                
                <Divider />
              </Box>
            ))}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                component={Link}
                to="/menu"
                startIcon={<ArrowBackIcon />}
              >
                Continuer mes achats
              </Button>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setCartItems([])}
              >
                Vider le panier
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Récapitulatif
            </Typography>
            
            <Box sx={{ my: 2 }}>
              {cartItems.map(item => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.dish.name} x{item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {(item.dish.price * item.quantity).toFixed(2)}€
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Sous-total</Typography>
              <Typography variant="h6">{getSubtotal().toFixed(2)}€</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Livraison</Typography>
              <Typography variant="body2">{deliveryFee.toFixed(2)}€</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Total</Typography>
              <Typography variant="h5" color="primary.main">
                {total.toFixed(2)}€
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Livraison estimée: 25-30 minutes
              </Typography>
            </Box>
            
            {!AuthService.isAuthenticated() && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Connectez-vous pour finaliser votre commande
              </Alert>
            )}
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleCheckout}
            >
              {AuthService.isAuthenticated() ? 'Passer la commande' : 'Se connecter pour commander'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;