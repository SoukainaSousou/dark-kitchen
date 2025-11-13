// src/pages/Categories.js
import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Bowls & Salades',
    description: 'Des bols équilibrés et salades fraîches',
    image: '/bowls.jpg',
    itemCount: 12,
    color: '#4caf50',
  },
  {
    id: 2,
    name: 'Burgers Gourmets',
    description: 'Burgers artisanaux avec ingrédients premium',
    image: '/burgers.jpg',
    itemCount: 8,
    color: '#ff9800',
  },
  {
    id: 3,
    name: 'Pizzas Créatives',
    description: 'Pizzas uniques avec des combinaisons innovantes',
    image: '/pizzas.jpg',
    itemCount: 10,
    color: '#f44336',
  },
  {
    id: 4,
    name: 'Plats Maison',
    description: 'Nos spécialités préparées avec passion',
    image: '/plats.jpg',
    itemCount: 15,
    color: '#2196f3',
  },
  {
    id: 5,
    name: 'Desserts',
    description: 'Pâtisseries et desserts faits maison',
    image: '/desserts.jpg',
    itemCount: 6,
    color: '#9c27b0',
  },
  {
    id: 6,
    name: 'Boissons',
    description: 'Rafraîchissements et boissons spéciales',
    image: '/boissons.jpg',
    itemCount: 8,
    color: '#00bcd4',
  },
];

const Categories = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Nos Catégories
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Découvrez tous nos plats organisés par catégories
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card 
              component={Link}
              to={`/menu?category=${category.id}`}
              sx={{ 
                textDecoration: 'none',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={category.image}
                alt={category.name}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`${category.itemCount} plats`} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" sx={{ color: category.color, fontWeight: 'bold' }}>
                    Explorer →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Categories;