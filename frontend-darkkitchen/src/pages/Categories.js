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
  Button  // ⚠️ Ajout de l'import manquant
} from '@mui/material';
import { Link } from 'react-router-dom';

// Couleurs prédéfinies pour chaque catégorie
const categoryColors = {
  'Bowls': '#4caf50',
  'Burgers': '#ff9800',
  'Pizzas': '#f44336',
  'Salades': '#2196f3',
  'Desserts': '#9c27b0',
  'Boissons': '#00bcd4',
  'Plats Maison': '#795548',
  'Asiatique': '#e91e63',
  'Italien': '#3f51b5',
  'Mexicain': '#ff5722',
  'Végétarien': '#4caf50',
  'Vegan': '#8bc34a',
  'Enfant': '#ffc107',
  'Spécialités': '#9c27b0',
  'default': '#757575'
};

// Images par défaut selon la catégorie
const defaultImages = {
  'Bowls': '/images/categories/bowls.jpg',
  'Burgers': '/images/categories/burgers.jpg',
  'Pizzas': '/images/categories/pizzas.jpg',
  'Salades': '/images/categories/salades.jpg',
  'Desserts': '/images/categories/desserts.jpg',
  'Boissons': '/images/categories/boissons.jpg',
  'Plats Maison': '/images/categories/plats.jpg',
  'default': '/images/categories/default.jpg'
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/dishes/categories');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Catégories reçues:', data);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories. Veuillez réessayer.');
        
        // En cas d'erreur, utiliser des catégories par défaut
        setCategories([
          { name: 'Bowls', count: 12, description: 'Des bols équilibrés et salades fraîches' },
          { name: 'Burgers', count: 8, description: 'Burgers artisanaux avec ingrédients premium' },
          { name: 'Pizzas', count: 10, description: 'Pizzas uniques avec des combinaisons innovantes' },
          { name: 'Salades', count: 6, description: 'Salades fraîches et équilibrées' },
          { name: 'Desserts', count: 5, description: 'Pâtisseries et desserts faits maison' },
          { name: 'Boissons', count: 8, description: 'Rafraîchissements et boissons spéciales' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Description par défaut selon la catégorie
  const getCategoryDescription = (categoryName) => {
    const descriptions = {
      'Bowls': 'Des bols équilibrés et salades fraîches',
      'Burgers': 'Burgers artisanaux avec ingrédients premium',
      'Pizzas': 'Pizzas uniques avec des combinaisons innovantes',
      'Salades': 'Salades fraîches et équilibrées',
      'Desserts': 'Pâtisseries et desserts faits maison',
      'Boissons': 'Rafraîchissements et boissons spéciales',
      'Plats Maison': 'Nos spécialités préparées avec passion',
      'Asiatique': 'Saveurs d\'Asie authentiques',
      'Italien': 'Spécialités italiennes traditionnelles',
      'Mexicain': 'Plats épicés et colorés du Mexique',
      'Végétarien': 'Options délicieuses sans viande',
      'Vegan': 'Plats 100% végétaux et savoureux',
      'Enfant': 'Portions adaptées pour les enfants',
      'Spécialités': 'Nos créations uniques et signature'
    };
    
    return descriptions[categoryName] || 'Découvrez nos délicieux plats';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des catégories...</Typography>
      </Container>
    );
  }

  if (error && categories.length === 0) {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Nos Catégories
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {categories.length} catégories disponibles - Découvrez tous nos plats organisés par catégories
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => {
          const categoryName = category.name || category.category;
          const itemCount = category.count || category.itemCount || 0;
          const color = categoryColors[categoryName] || categoryColors.default;
          const image = defaultImages[categoryName] || defaultImages.default;
          const description = category.description || getCategoryDescription(categoryName);

          return (
            <Grid item xs={12} sm={6} md={4} key={categoryName}>
              <Card 
                component={Link}
                to={`/menu?category=${encodeURIComponent(categoryName.toLowerCase())}`}
                sx={{ 
                  textDecoration: 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                  },
                  borderTop: `4px solid ${color}`,
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    height: 200,
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  image={image}
                  alt={categoryName}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                      fontSize: '1.25rem'
                    }}
                  >
                    {categoryName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                      minHeight: 48
                    }}
                  >
                    {description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <Chip 
                      label={`${itemCount} ${itemCount > 1 ? 'plats' : 'plat'}`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: `${color}15`, // 15 = ~10% d'opacité
                        color: color,
                        border: `1px solid ${color}30`,
                        fontWeight: 'medium'
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: color, 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Explorer →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {categories.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune catégorie disponible pour le moment.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les catégories apparaîtront automatiquement lorsque des plats seront ajoutés.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Categories;