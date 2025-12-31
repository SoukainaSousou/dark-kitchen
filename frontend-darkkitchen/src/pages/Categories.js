// src/pages/Categories.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';

// Mappage des émojis aux icônes Material-UI
const emojiToIconMap = {
  '🍔': FastfoodIcon,
  '🍕': LocalPizzaIcon,
  '🍛': RiceBowlIcon,
  '🥗': RestaurantMenuIcon,
  '🍰': IcecreamIcon,
  '🍹': LocalBarIcon,
  '🍝': LunchDiningIcon,
  '🌮': RestaurantMenuIcon,
  '🍣': RestaurantMenuIcon,
  '🥦': RestaurantMenuIcon,
  '👶': RestaurantMenuIcon,
  '👨‍🍳': RestaurantMenuIcon,
  '🌱': RestaurantMenuIcon,
  '🍽️': RestaurantMenuIcon
};

// Icônes, couleurs, emojis et images pour chaque catégorie
const categoryConfig = {
  'Burger': { 
    color: '#ff9800', 
    icon: FastfoodIcon, 
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
  },
  'Pizza': { 
    color: '#f44336', 
    icon: LocalPizzaIcon, 
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80'
  },
  'Pizzas': { 
    color: '#f44336', 
    icon: LocalPizzaIcon, 
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80'
  },
  'Bowls': { 
    color: '#4caf50', 
    icon: RiceBowlIcon, 
    emoji: '🍛',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
  },
  'Burgers': { 
    color: '#ff9800', 
    icon: FastfoodIcon, 
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
  },
  'Salades': { 
    color: '#2196f3', 
    icon: RestaurantMenuIcon, 
    emoji: '🥗',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80'
  },
  'Desserts': { 
    color: '#9c27b0', 
    icon: IcecreamIcon, 
    emoji: '🍰',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=80'
  },
  'Boissons': { 
    color: '#00bcd4', 
    icon: LocalBarIcon, 
    emoji: '🍹',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80'
  },
  'Plats Maison': { 
    color: '#795548', 
    icon: LunchDiningIcon, 
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80'
  },
  'Asiatique': { 
    color: '#e91e63', 
    icon: RestaurantMenuIcon, 
    emoji: '🍣',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80'
  },
  'Italien': { 
    color: '#3f51b5', 
    icon: RestaurantMenuIcon, 
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500&auto=format&fit=crop&q=80'
  },
  'Mexicain': { 
    color: '#ff5722', 
    icon: RestaurantMenuIcon, 
    emoji: '🌮',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80'
  },
  'Végétarien': { 
    color: '#4caf50', 
    icon: RestaurantMenuIcon, 
    emoji: '🥦',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  },
  'Vegan': { 
    color: '#8bc34a', 
    icon: RestaurantMenuIcon, 
    emoji: '🌱',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80'
  },
  'Enfant': { 
    color: '#ffc107', 
    icon: RestaurantMenuIcon, 
    emoji: '👶',
    image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&auto=format&fit=crop&q=80'
  },
  'Spécialités': { 
    color: '#9c27b0', 
    icon: RestaurantMenuIcon, 
    emoji: '👨‍🍳',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
  },
  'default': { 
    color: '#757575', 
    icon: RestaurantMenuIcon, 
    emoji: '🍽️',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80'
  }
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les catégories et les plats depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Récupérer les catégories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        
        if (!categoriesResponse.ok) {
          throw new Error(`Erreur lors de la récupération des catégories: ${categoriesResponse.status}`);
        }
        
        const categoriesData = await categoriesResponse.json();
        console.log('Catégories API:', categoriesData);
        
        // 2. Récupérer tous les plats
        let dishesData = [];
        try {
          const dishesResponse = await fetch('http://localhost:8080/api/dishes');
          if (dishesResponse.ok) {
            dishesData = await dishesResponse.json();
            console.log('Plats API:', dishesData);
          }
        } catch (dishesError) {
          console.warn('Erreur lors de la récupération des plats:', dishesError);
          // On continue sans les plats
        }
        
        setCategories(categoriesData);
        setDishes(dishesData);
        
      } catch (err) {
        console.error('Erreur détaillée:', err);
        setError(`Impossible de charger les catégories: ${err.message}`);
        
        // Données de démonstration en cas d'erreur
        const demoCategories = [
          { id: 1, name: 'Pizza', description: 'Délicieuses pizzas cuites au feu de bois', icon: '🍕' },
          { id: 2, name: 'Burger', description: 'Burgers gourmets avec ingrédients premium', icon: '🍔' },
          { id: 3, name: 'Salades', description: 'Salades fraîches et équilibrées', icon: '🥗' },
          { id: 4, name: 'Desserts', description: 'Pâtisseries et douceurs maison', icon: '🍰' },
          { id: 5, name: 'Boissons', description: 'Rafraîchissements et cocktails', icon: '🍹' },
          { id: 6, name: 'Spécialités', description: 'Nos créations uniques', icon: '👨‍🍳' }
        ];
        setCategories(demoCategories);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compter le nombre de plats par catégorie
  const getDishCountByCategory = (categoryId) => {
    if (!dishes || dishes.length === 0) return 0;
    
    const count = dishes.filter(dish => {
      if (dish.category) {
        return typeof dish.category === 'object' 
          ? dish.category.id === categoryId
          : dish.category === categoryId;
      }
      return false;
    }).length;
    
    return count;
  };

  // Obtenir la configuration complète pour une catégorie
  const getCategoryConfig = (category) => {
    const categoryName = category.name;
    
    // Chercher d'abord une correspondance exacte
    if (categoryConfig[categoryName]) {
      return categoryConfig[categoryName];
    }
    
    // Chercher une correspondance partielle (par exemple "Pizza" pour "Pizzas")
    const normalizedName = categoryName.toLowerCase().replace(/s$/, '');
    const matchingKey = Object.keys(categoryConfig).find(key => 
      key.toLowerCase().replace(/s$/, '') === normalizedName
    );
    
    if (matchingKey) {
      return categoryConfig[matchingKey];
    }
    
    // Défaut
    return categoryConfig.default;
  };

  // Obtenir la description par défaut
  const getDefaultDescription = (categoryName) => {
    const descriptions = {
      'Pizza': 'Délicieuses pizzas cuites au feu de bois avec des ingrédients frais et de qualité',
      'Pizzas': 'Délicieuses pizzas cuites au feu de bois avec des ingrédients frais et de qualité',
      'Burger': 'Burgers gourmets préparés avec des viandes premium, pains briochés et sauces maison',
      'Burgers': 'Burgers gourmets préparés avec des viandes premium, pains briochés et sauces maison',
      'Bowls': 'Bols équilibrés et gourmands, parfaits pour un repas sain et savoureux',
      'Salades': 'Salades fraîches, croquantes et équilibrées pour une alimentation saine et légère',
      'Desserts': 'Pâtisseries et desserts faits maison pour terminer votre repas en douceur',
      'Boissons': 'Rafraîchissements, cocktails sans alcool et boissons spéciales préparées maison',
      'Plats Maison': 'Nos spécialités traditionnelles préparées avec passion et savoir-faire',
      'Asiatique': 'Saveurs authentiques d\'Asie : woks, nouilles et spécialités régionales',
      'Italien': 'Spécialités italiennes : pâtes fraîches, risottos et antipasti traditionnels',
      'Mexicain': 'Plats épicés et colorés du Mexique : tacos, burritos et guacamole frais',
      'Végétarien': 'Options délicieuses et nutritives sans viande, riches en saveurs',
      'Vegan': 'Plats 100% végétaux, savoureux, créatifs et respectueux de l\'environnement',
      'Enfant': 'Portions adaptées et menus spécialement conçus pour les plus jeunes',
      'Spécialités': 'Nos créations uniques et plats signature préparés par nos chefs'
    };
    
    return descriptions[categoryName] || 'Découvrez nos délicieux plats dans cette catégorie';
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Chargement des catégories...
        </Typography>
      </Container>
    );
  }

  if (error && (!categories || categories.length === 0)) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* En-tête */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary.main">
          Nos Catégories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explorez notre menu organisé par catégories. Chaque catégorie offre une expérience culinaire unique.
        </Typography>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            backgroundColor: 'primary.light',
            color: 'white',
            borderRadius: 2
          }}>
            <Typography variant="h4" fontWeight="bold">
              {categories.length}
            </Typography>
            <Typography variant="body2">
              Catégories
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            backgroundColor: 'secondary.light',
            color: 'white',
            borderRadius: 2
          }}>
            <Typography variant="h4" fontWeight="bold">
              {dishes.length}
            </Typography>
            <Typography variant="body2">
              Plats au total
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Liste des catégories */}
      {categories && categories.length > 0 ? (
        <Grid container spacing={3}>
          {categories.map((category) => {
            const config = getCategoryConfig(category);
            const IconComponent = config.icon;
            const dishCount = getDishCountByCategory(category.id);
            const description = category.description || getDefaultDescription(category.name);

            return (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  component={Link}
                  to={`/menu?category=${category.id}`}
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: config.color + '30',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${config.color}20`,
                      borderColor: config.color,
                      '& .category-image': {
                        transform: 'scale(1.1)'
                      },
                      '& .category-emoji': {
                        transform: 'scale(1.2) rotate(5deg)'
                      }
                    }
                  }}
                >
                  {/* Image de fond de la catégorie */}
                  <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      className="category-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s ease'
                      }}
                      image={config.image}
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                    {/* Overlay avec emoji */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box className="category-emoji" sx={{ 
                        transition: 'transform 0.3s ease',
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}>
                        <Typography variant="h1" sx={{ 
                          fontSize: '5rem', 
                          lineHeight: 1,
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                        }}>
                          {config.emoji}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Badge avec compteur de plats */}
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 20,
                      px: 1.5,
                      py: 0.5
                    }}>
                      <Typography variant="caption" fontWeight="bold" color="text.primary">
                        {dishCount} plat{dishCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    backgroundColor: 'background.paper'
                  }}>
                    {/* Nom de la catégorie */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: config.color + '20',
                        color: config.color
                      }}>
                        <IconComponent />
                      </Box>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          color: 'text.primary',
                          flex: 1
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        lineHeight: 1.6,
                        minHeight: 60
                      }}
                    >
                      {description}
                    </Typography>

                    {/* Bouton d'exploration */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      mt: 'auto'
                    }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Cliquez pour explorer
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                        color: config.color,
                        fontWeight: 'bold'
                      }}>
                        <Typography variant="body2">
                          Voir les plats
                        </Typography>
                        <Box component="span" sx={{ fontSize: '1.2rem', ml: 0.5 }}>→</Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucune catégorie disponible
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Les catégories apparaîtront lorsque des plats seront ajoutés dans l'administration.
          </Typography>
          <Button 
            variant="contained" 
            component={Link}
            to="/menu"
          >
            Voir tous les plats
          </Button>
        </Box>
      )}

      {/* Footer informatif */}
      <Box sx={{ mt: 8, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Vous ne trouvez pas ce que vous cherchez ? 
        </Typography>
        <Button 
          component={Link} 
          to="/menu" 
          variant="text"
          sx={{ mt: 1 }}
        >
          Consultez notre menu complet
        </Button>
      </Box>
    </Container>
  );
};

export default Categories;