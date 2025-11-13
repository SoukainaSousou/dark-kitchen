// src/pages/Home.js
import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';

const featuredDishes = [
  {
    id: 1,
    name: "Poulet Teriyaki Bowl",
    description: "Poulet mariné teriyaki, riz japonais, légumes croquants",
    price: 14.90,
    image: "/poulet-teriyaki.jpg",
    category: "Bowls",
    rating: 4.8,
    prepTime: "15-20 min",
    isPopular: true,
  },
  {
    id: 2,
    name: "Burger Gourmet",
    description: "Steak angus, cheddar affiné, bacon croustillant, sauce maison",
    price: 16.50,
    image: "/burger-gourmet.jpg",
    category: "Burgers",
    rating: 4.9,
    prepTime: "20-25 min",
    isNew: true,
  },
  {
    id: 3,
    name: "Pizza Truffe",
    description: "Base crème fraîche, mozzarella di buffala, truffe noire",
    price: 22.00,
    image: "/pizza-truffe.jpg",
    category: "Pizzas",
    rating: 4.7,
    prepTime: "18-22 min",
  },
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            TasteLab
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Cuisine créative • Livraison express
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Découvrez une expérience culinaire unique avec nos plats signature 
            préparés par nos chefs. Livraison en moins de 30 minutes.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: 'white', 
                color: 'primary.main',
                '&:hover': { backgroundColor: 'grey.100' }
              }}
              component={Link}
              to="/menu"
            >
              Voir le Menu
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
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
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">Livraison 25min</Typography>
              <Typography variant="body2">Temps moyen</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">4.8/5</Typography>
              <Typography variant="body2">Note clients</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
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

        <Grid container spacing={4}>
          {featuredDishes.map((dish) => (
            <Grid item xs={12} md={4} key={dish.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                {dish.isPopular && (
                  <Chip 
                    label="Populaire" 
                    color="secondary" 
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                  />
                )}
                {dish.isNew && (
                  <Chip 
                    label="Nouveau" 
                    color="primary" 
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                  />
                )}
                
                <CardMedia
                  component="img"
                  height="200"
                  image={dish.image}
                  alt={dish.name}
                />
                
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {dish.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {dish.price}€
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {dish.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={dish.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({dish.rating})
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<ScheduleIcon />} 
                      label={dish.prepTime} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/menu"
                  >
                    Commander
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Section Process */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Comment ça marche ?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4} textAlign="center">
              <Box sx={{ fontSize: 60, mb: 2 }}>🍽️</Box>
              <Typography variant="h6" gutterBottom>1. Choisissez</Typography>
              <Typography variant="body2" color="text.secondary">
                Parcourez notre menu et sélectionnez vos plats préférés
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Box sx={{ fontSize: 60, mb: 2 }}>🛒</Box>
              <Typography variant="h6" gutterBottom>2. Commandez</Typography>
              <Typography variant="body2" color="text.secondary">
                Ajoutez au panier et finalisez votre commande
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Box sx={{ fontSize: 60, mb: 2 }}>🚚</Box>
              <Typography variant="h6" gutterBottom>3. Livraison</Typography>
              <Typography variant="body2" color="text.secondary">
                Recevez en 25 minutes en moyenne
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;