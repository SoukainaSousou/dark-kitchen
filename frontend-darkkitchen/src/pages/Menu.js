// src/pages/Menu.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Tabs,
  Tab,
  Rating,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({});
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les plats depuis l'API
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/dishes');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données reçues:', data);
        setDishes(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des plats:', err);
        setError('Impossible de charger le menu. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Extraire les catégories uniques depuis les données
  const categories = [
    { value: 'all', label: 'Tout le Menu' },
    ...Array.from(new Set(dishes.map(dish => dish.category)))
      .filter(Boolean)
      .map(category => ({
        value: category.toLowerCase(),
        label: category.charAt(0).toUpperCase() + category.slice(1)
      }))
  ];

  // Filtrer les plats par catégorie
  const filteredItems = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(item => 
        item.category && item.category.toLowerCase() === selectedCategory
      );

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleAddToCart = (dish) => {
    const quantity = quantities[dish.id] || 1;
    console.log(`Ajout au panier: ${dish.name} x${quantity}`);
    alert(`${quantity} ${dish.name}(s) ajouté(s) au panier!`);
    setQuantities(prev => ({ ...prev, [dish.id]: 0 }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du menu...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Container>
    );
  }

  if (dishes.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Aucun plat disponible pour le moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Notre Menu Complet
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {dishes.length} plats disponibles
      </Typography>

      {/* Filtres par catégorie */}
      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        sx={{ mb: 4 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map(category => (
          <Tab 
            key={category.value} 
            value={category.value} 
            label={category.label} 
          />
        ))}
      </Tabs>

      {/* Liste des plats en GRID pour avoir des cadres de même taille */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              // Taille fixe pour toutes les cartes
              minHeight: 400,
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              {/* Image avec hauteur fixe */}
              <CardMedia
                component="img"
                sx={{ 
                  width: '100%',
                  height: 180,
                  objectFit: 'cover'
                }}
                image={item.image || '/images/default-dish.jpg'}
                alt={item.name}
              />
              
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                p: 2.5
              }}>
                {/* En-tête avec nom et prix */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1.5
                }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      flex: 1,
                      mr: 1
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="primary.main" 
                    fontWeight="bold"
                    sx={{ fontSize: '1.2rem' }}
                  >
                    {item.price?.toFixed(2) || '0.00'}€
                  </Typography>
                </Box>

                {/* Description avec hauteur fixe */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    flex: 1,
                    minHeight: 40,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.description}
                </Typography>

                {/* Tags et informations */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 2, 
                  flexWrap: 'wrap',
                  minHeight: 32
                }}>
                  <Chip 
                    label={item.prepTime || '20-25 min'} 
                    size="small" 
                    variant="outlined"
                    sx={{ height: 24, fontSize: '0.75rem' }}
                  />
                  {item.popular && (
                    <Chip 
                      label="Populaire" 
                      size="small" 
                      color="secondary"
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  )}
                  {item.newDish && (
                    <Chip 
                      label="Nouveau" 
                      size="small" 
                      color="primary"
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                    <Rating 
                      value={item.rating || 0} 
                      readOnly 
                      size="small" 
                      precision={0.1}
                    />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      ({item.rating?.toFixed(1) || '0.0'})
                    </Typography>
                  </Box>
                </Box>

                {/* Catégorie */}
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Catégorie: {item.category || 'Non catégorisé'}
                </Typography>

                {/* Contrôles de quantité et bouton Ajouter */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                  {/* Sélecteur de quantité */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, -1)}
                      sx={{ 
                        width: 30,
                        height: 30,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        minWidth: 30, 
                        textAlign: 'center',
                        fontWeight: 'medium'
                      }}
                    >
                      {quantities[item.id] || 0}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, 1)}
                      sx={{ 
                        width: 30,
                        height: 30,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Bouton Ajouter */}
                  <Button 
                    variant="contained" 
                    onClick={() => handleAddToCart(item)}
                    disabled={!(quantities[item.id] > 0)}
                    sx={{ 
                      minWidth: 100,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: '#e91e63',
                      '&:hover': {
                        backgroundColor: '#ad1457'
                      }
                    }}
                  >
                    {quantities[item.id] > 0 ? `Ajouter (${quantities[item.id]})` : 'Ajouter'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Message si aucun plat trouvé */}
      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun plat trouvé dans cette catégorie
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSelectedCategory('all')}
            sx={{ mt: 2 }}
          >
            Voir tout le menu
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Menu;