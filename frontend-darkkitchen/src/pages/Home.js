// Home.js
import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardMedia, Chip, Rating, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Checkbox, Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';
import { DishService } from '../services/DishService';

const Home = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour le popup de commande
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [orderForm, setOrderForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    createAccount: true,
    specialInstructions: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        setLoading(true);
        const data = await DishService.getFeaturedDishes();
        setFeaturedDishes(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les plats vedettes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDishes();
  }, []);

  // Fonction pour gérer le clic sur "Commander"
  const handleOrderClick = (dish) => {
    setSelectedDish(dish);
    setOpenOrderDialog(true);
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Fonction pour soumettre la commande
  const handleOrderSubmit = async () => {
    // Validation basique
    if (!orderForm.firstName || !orderForm.lastName || !orderForm.email || !orderForm.phoneNumber) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        severity: 'error'
      });
      return;
    }

    if (orderForm.createAccount && !orderForm.password) {
      setSnackbar({
        open: true,
        message: 'Veuillez créer un mot de passe pour votre compte',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      // Structure de données pour l'API
      const orderData = {
        dishId: selectedDish.id,
        clientInfo: {
          firstName: orderForm.firstName,
          lastName: orderForm.lastName,
          email: orderForm.email,
          password: orderForm.createAccount ? orderForm.password : null,
          phoneNumber: orderForm.phoneNumber,
          address: orderForm.address,
          city: orderForm.city,
          postalCode: orderForm.postalCode,
          createAccount: orderForm.createAccount
        },
        specialInstructions: orderForm.specialInstructions,
        quantity: 1 // Par défaut 1, pourrait être modifiable
      };

      // Appel API - À ADAPTER avec votre endpoint réel
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        
        setSnackbar({
          open: true,
          message: `Commande passée avec succès ! Numéro de commande: ${result.orderNumber}`,
          severity: 'success'
        });
        
        // Réinitialiser le formulaire
        setOrderForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          address: '',
          city: '',
          postalCode: '',
          createAccount: true,
          specialInstructions: ''
        });
        
        setOpenOrderDialog(false);
        
        // Redirection vers la page de confirmation ou espace client
        // Si l'utilisateur a créé un compte, on pourrait le rediriger
        if (orderForm.createAccount && result.token) {
          // Stocker le token JWT
          localStorage.setItem('token', result.token);
          localStorage.setItem('client', JSON.stringify(result.client));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la commande');
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fonction pour fermer le popup
  const handleCloseDialog = () => {
    setOpenOrderDialog(false);
    // Optionnel: réinitialiser partiellement le formulaire
    setOrderForm({
      ...orderForm,
      specialInstructions: ''
    });
  };

  // Fonction pour fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>TasteLab</Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Cuisine créative • Livraison express
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Découvrez une expérience culinaire unique avec nos plats signature préparés par nos chefs. Livraison en moins de 30 minutes.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: 'grey.100' } }} component={Link} to="/menu">
              Voir le Menu
            </Button>
            <Button variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} component={Link} to="/categories">
              Par Catégories
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} sm={4} textAlign="center">
              <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">Livraison 25min</Typography>
              <Typography variant="body2">Temps moyen</Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <StarIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">4.8/5</Typography>
              <Typography variant="body2">Note clients</Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">7j/7</Typography>
              <Typography variant="body2">11h-23h</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Plats en Vedette */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Nos Spécialités
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Découvrez nos plats les plus appréciés
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : featuredDishes.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            Aucun plat vedette disponible pour le moment.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredDishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} key={dish.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Badges */}
                  <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, display: 'flex', gap: 1 }}>
                    {dish.popular && <Chip label="Populaire" color="secondary" size="small" />}
                    {dish.isNewDish && <Chip label="Nouveau" color="primary" size="small" />}
                  </Box>
                  
                  {/* Image */}
                  <CardMedia 
                    component="img" 
                    height="200" 
                    image={dish.image || '/default-dish.jpg'} 
                    alt={dish.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* Contenu */}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Nom du plat et prix */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h3" fontWeight="medium">
                        {dish.name}
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {dish.price}€
                      </Typography>
                    </Box>
                    
                    {/* Catégorie */}
                    {dish.category && (
                      <Chip 
                        label={dish.category.name} 
                        size="small" 
                        sx={{ 
                          mb: 2, 
                          alignSelf: 'flex-start',
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }} 
                      />
                    )}
                    
                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {dish.description}
                    </Typography>
                    
                    {/* Note et temps de préparation */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={dish.rating || 0} 
                          readOnly 
                          size="small" 
                          precision={0.5}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({dish.rating || 0})
                        </Typography>
                      </Box>
                      <Chip 
                        icon={<ScheduleIcon />} 
                        label={dish.prepTime || '15 min'} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                    
                    {/* Bouton Commander */}
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => handleOrderClick(dish)}
                    >
                      Commander
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialog pour la commande */}
      <Dialog 
        open={openOrderDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '80vh' }
        }}
      >
        <DialogTitle>
          Commander {selectedDish?.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedDish && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Détails du plat</Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography><strong>{selectedDish.name}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDish.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Catégorie: {selectedDish.category?.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography variant="h6" color="primary.main">
                    {selectedDish.price}€
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Temps de préparation: {selectedDish.prepTime || '15 min'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Informations personnelles
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom *"
                name="firstName"
                value={orderForm.firstName}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom *"
                name="lastName"
                value={orderForm.lastName}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={orderForm.email}
                onChange={handleInputChange}
                required
                disabled={submitting}
                helperText="Vous recevrez la confirmation de commande par email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone *"
                name="phoneNumber"
                value={orderForm.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={submitting}
                helperText="Pour la livraison"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="createAccount"
                    checked={orderForm.createAccount}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                }
                label="Créer un compte pour suivre mes commandes"
              />
            </Grid>
            
            {orderForm.createAccount && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mot de passe *"
                  name="password"
                  type="password"
                  value={orderForm.password}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  helperText="Minimum 6 caractères"
                />
              </Grid>
            )}
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Adresse de livraison
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse *"
                name="address"
                value={orderForm.address}
                onChange={handleInputChange}
                required
                disabled={submitting}
                placeholder="Numéro et rue"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ville *"
                name="city"
                value={orderForm.city}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Code postal *"
                name="postalCode"
                value={orderForm.postalCode}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions spéciales"
                name="specialInstructions"
                multiline
                rows={3}
                value={orderForm.specialInstructions}
                onChange={handleInputChange}
                disabled={submitting}
                placeholder="Allergies, préférences alimentaires, code d'entrée, etc."
              />
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Livraison estimée:</strong> 25-30 minutes
              <br />
              <strong>Paiement:</strong> À la livraison (espèces ou carte)
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleOrderSubmit}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {submitting ? 'Traitement...' : 'Confirmer la commande'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;