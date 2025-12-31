// Home.js
import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardMedia, Chip, Rating, CircularProgress, Alert
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

  return (
    <Box>
      {/* Hero Section (inchangée) */}
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
                      component={Link}
                      to={`/dish/${dish.id}`} // Lien vers la page détail du plat
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
    </Box>
  );
};

export default Home;