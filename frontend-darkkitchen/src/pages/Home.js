// Home.js
import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardMedia, Chip, Rating, CircularProgress, Alert, IconButton, Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Récupérer toutes les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les catégories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        if (!categoriesResponse.ok) throw new Error('Erreur catégories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Récupérer tous les plats
        const dishesResponse = await fetch('http://localhost:8080/api/dishes');
        if (!dishesResponse.ok) throw new Error('Erreur plats');
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des quantités
  const handleQuantityChange = (dishId, change) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + change)
    }));
  };

  // Ajouter au panier
  const handleAddToCart = (dish) => {
    const quantity = quantities[dish.id] || 1;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Vérifier si le plat existe déjà dans le panier
    const existingItemIndex = cart.findIndex(item => item.id === dish.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${dish.name}(s) ajouté(s) au panier!`);
    setQuantities(prev => ({ ...prev, [dish.id]: 0 }));
  };

  // Récupérer les plats par catégorie (max 4 par catégorie)
  const getDishesByCategory = (categoryId) => {
    return dishes
      .filter(dish => dish.category && dish.category.id === categoryId)
      .slice(0, 4);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)', 
        color: 'white', 
        py: { xs: 8, md: 12 },
        textAlign: 'center' 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            TasteLab
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Cuisine créative • Livraison express
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Découvrez notre menu exceptionnel préparé avec des ingrédients frais et de saison. 
            Livraison rapide et service impeccable.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                backgroundColor: 'white', 
                color: '#e91e63', 
                fontWeight: 'bold',
                px: 4,
                '&:hover': { backgroundColor: 'grey.100' } 
              }} 
              component={Link} 
              to="/menu"
            >
              Voir le Menu Complet
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                borderColor: 'white', 
                color: 'white', 
                fontWeight: 'bold',
                px: 4,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
              }} 
              component={Link} 
              to="/categories"
            >
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
              <RestaurantIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">{dishes.length}+</Typography>
              <Typography variant="body2">Plats disponibles</Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <StarIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">4.8/5</Typography>
              <Typography variant="body2">Note clients</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Catégories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nos Catégories
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Parcourez notre menu par catégories
        </Typography>

        {error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : categories.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            Aucune catégorie disponible.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {categories.slice(0, 4).map((category) => {
              const categoryDishes = getDishesByCategory(category.id);
              
              return (
                <Grid item xs={12} sm={6} md={3} key={category.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
                          {category.name}
                        </Typography>
                        <Chip 
                          label={`${categoryDishes.length} plats`} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>
                      
                      {category.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {category.description}
                        </Typography>
                      )}

                      {/* Aperçu des plats de la catégorie */}
                      <Box sx={{ mb: 3 }}>
                        {categoryDishes.length > 0 ? (
                          <Stack spacing={1}>
                            {categoryDishes.map(dish => (
                              <Box key={dish.id} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 1,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                              }}>
                                <Typography variant="body2" sx={{ flex: 1, fontSize: '0.9rem' }}>
                                  {dish.name}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="#e91e63">
                                  {dish.price?.toFixed(2) || '0.00'}€
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Aucun plat dans cette catégorie
                          </Typography>
                        )}
                      </Box>

                      <Button 
                        fullWidth 
                        variant="contained" 
                        component={Link}
                        to={`/menu?category=${category.id}`}
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: '#e91e63',
                          '&:hover': {
                            backgroundColor: '#ad1457'
                          }
                        }}
                      >
                        Voir tous les plats
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Section Tous les Plats */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold" color="#e91e63">
            Tous Nos Plats
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Découvrez notre sélection complète de {dishes.length} plats
          </Typography>

          {dishes.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Aucun plat disponible pour le moment.
            </Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {dishes.map((dish) => {
                  const quantity = quantities[dish.id] || 0;
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6
                        }
                      }}>
                        {/* Image du plat */}
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia 
                            component="img" 
                            height="160" 
                            image={dish.image || 'https://via.placeholder.com/300x160?text=Plat+Image'} 
                            alt={dish.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          
                          {/* Badges */}
                          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                            {dish.isPopular && (
                              <Chip label="⭐ Populaire" color="warning" size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                            )}
                            {dish.isNew && (
                              <Chip label="🆕 Nouveau" color="success" size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                            )}
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          {/* Nom et prix */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={{ flex: 1, mr: 1, fontSize: '0.95rem' }}>
                              {dish.name}
                            </Typography>
                            <Typography variant="h6" color="#e91e63" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                              {dish.price?.toFixed(2) || '0.00'}€
                            </Typography>
                          </Box>
                          
                          {/* Catégorie */}
                          {dish.category && (
                            <Chip 
                              label={dish.category.name} 
                              size="small" 
                              sx={{ 
                                mb: 1,
                                backgroundColor: '#e91e63',
                                color: 'white',
                                fontWeight: 'medium',
                                fontSize: '0.7rem'
                              }} 
                            />
                          )}
                          
                          {/* Description */}
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px', fontSize: '0.8rem' }}>
                            {dish.description && dish.description.length > 70 
                              ? `${dish.description.substring(0, 70)}...` 
                              : dish.description || 'Description non disponible'}
                          </Typography>
                          
                          {/* Note et temps */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating 
                                value={dish.rating || 0} 
                                readOnly 
                                size="small" 
                                precision={0.5}
                                sx={{ fontSize: '1rem' }}
                              />
                              <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                                ({dish.rating?.toFixed(1) || '0.0'})
                              </Typography>
                            </Box>
                            <Chip 
                              icon={<ScheduleIcon fontSize="small" />}
                              label={dish.prepTime || '20 min'}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                          
                          {/* Sélecteur de quantité et bouton commander */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                          }}>
                            {/* Sélecteur de quantité */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(dish.id, -1)}
                                disabled={quantity === 0}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  width: 28,
                                  height: 28
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  minWidth: 30, 
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {quantity}
                              </Typography>
                              
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(dish.id, 1)}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  width: 28,
                                  height: 28
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            {/* Bouton commander */}
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddToCart(dish)}
                              disabled={quantity === 0}
                              sx={{
                                minWidth: 90,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                backgroundColor: '#e91e63',
                                '&:hover': {
                                  backgroundColor: '#ad1457'
                                }
                              }}
                            >
                              {quantity > 0 ? `Ajouter` : 'Ajouter'}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              
              {/* Bouton vers le menu complet (optionnel, car on affiche déjà tout) */}
              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Affichage de tous les {dishes.length} plats
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/menu"
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderColor: '#e91e63',
                    color: '#e91e63',
                    '&:hover': {
                      backgroundColor: '#e91e63',
                      color: 'white'
                    }
                  }}
                >
                  Voir le menu organisé par catégories →
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;