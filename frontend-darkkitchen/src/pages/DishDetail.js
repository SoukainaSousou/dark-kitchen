// src/pages/DishDetail.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Rating,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DishService from '../services/DishService';

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialRequest, setSpecialRequest] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchDishDetails();
  }, [id]);

  const fetchDishDetails = async () => {
    try {
      setLoading(true);
      
      // Données mockées pour le développement
      const mockDish = {
        id: parseInt(id),
        name: 'Pizza Margherita',
        description: 'Une pizza classique avec sauce tomate, mozzarella fraîche et basilic. Préparée avec amour par nos chefs italiens.',
        price: 12.50,
        image: '/images/pizza.jpg',
        category: { id: 1, name: 'Pizzas' },
        rating: 4.5,
        prepTime: '15-20 min',
        popular: true,
        newDish: false,
        ingredients: ['Sauce tomate', 'Mozzarella', 'Basilic frais', 'Huile d\'olive'],
        allergens: ['Lait', 'Gluten'],
        calories: 850
      };
      
      setDish(mockDish);
      
      // Une fois l'API prête, utilisez:
      // const data = await DishService.getDishById(id);
      // setDish(data);
      
    } catch (err) {
      setError('Erreur lors du chargement du plat');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Ici, vous devriez ajouter au contexte panier
    const cartItem = {
      dish: dish,
      quantity: quantity,
      specialRequest: specialRequest
    };
    
    // Simuler l'ajout au panier
    console.log('Ajout au panier:', cartItem);
    setAddedToCart(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setAddedToCart(false);
      setQuantity(1);
      setSpecialRequest('');
    }, 3000);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !dish) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Plat non trouvé'}
        </Alert>
        <Button component={Link} to="/menu" startIcon={<ArrowBackIcon />}>
          Retour au menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/menu"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Retour au menu
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ overflow: 'hidden' }}>
            <Box
              component="img"
              src={dish.image || '/default-dish.jpg'}
              alt={dish.name}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            {/* En-tête avec badges */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {dish.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {dish.category && (
                    <Chip
                      label={dish.category.name}
                      size="small"
                      sx={{ backgroundColor: 'primary.light', color: 'white' }}
                    />
                  )}
                  {dish.popular && (
                    <Chip
                      icon={<LocalFireDepartmentIcon />}
                      label="Populaire"
                      color="secondary"
                      size="small"
                    />
                  )}
                  {dish.newDish && (
                    <Chip
                      icon={<NewReleasesIcon />}
                      label="Nouveau"
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {dish.price}€
              </Typography>
            </Box>

            {/* Description */}
            <Typography variant="body1" paragraph color="text.secondary">
              {dish.description}
            </Typography>

            {/* Note et temps de préparation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={dish.rating} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({dish.rating})
                </Typography>
              </Box>
              <Chip
                icon={<AccessTimeIcon />}
                label={dish.prepTime || '15-20 min'}
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informations nutritionnelles */}
            {dish.ingredients && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ingrédients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dish.ingredients.map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {dish.allergens && dish.allergens.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Allergènes
                </Typography>
                <Typography variant="body2" color="error">
                  {dish.allergens.join(', ')}
                </Typography>
              </Box>
            )}

            {dish.calories && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informations nutritionnelles
                </Typography>
                <Typography variant="body2">
                  Environ {dish.calories} kcal
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Ajout au panier */}
            <Box>
              {addedToCart && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Ajouté au panier avec succès !
                </Alert>
              )}

              <Typography variant="h6" gutterBottom>
                Commander
              </Typography>

              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>
                      {quantity}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" textAlign="right">
                    Total: {(dish.price * quantity).toFixed(2)}€
                  </Typography>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Demandes spéciales"
                multiline
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Allergies, modifications..."
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                  >
                    Ajouter au panier
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleOrderNow}
                  >
                    Commander maintenant
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DishDetail;