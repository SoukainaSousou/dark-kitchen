// src/pages/Menu.js
import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const menuItems = [
  {
    id: 1,
    name: "Bowl Poulet Teriyaki",
    description: "Riz japonais, poulet teriyaki, avocat, carottes, concombre, sésame",
    price: 14.90,
    image: "/bowl-poulet.jpg",
    category: "bowls",
    rating: 4.8,
    prepTime: "15 min",
    calories: "450 kcal",
    isVegetarian: false,
    isSpicy: false,
  },
  {
    id: 2,
    name: "Burger Angus",
    description: "Steak angus 180g, cheddar, bacon, oignons caramélisés, sauce burger",
    price: 16.50,
    image: "/burger-angus.jpg",
    category: "burgers",
    rating: 4.9,
    prepTime: "20 min",
    calories: "720 kcal",
    isVegetarian: false,
    isSpicy: false,
  },
  // Ajouter plus d'items...
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({});

  const categories = [
    { value: 'all', label: 'Tout le Menu' },
    { value: 'bowls', label: 'Bowls' },
    { value: 'burgers', label: 'Burgers' },
    { value: 'pizzas', label: 'Pizzas' },
    { value: 'desserts', label: 'Desserts' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Notre Menu Complet
      </Typography>

      {/* Filtres par catégorie */}
      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        sx={{ mb: 4 }}
      >
        {categories.map(category => (
          <Tab key={category.value} value={category.value} label={category.label} />
        ))}
      </Tabs>

      {/* Liste des plats */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card sx={{ display: 'flex', height: 160 }}>
              <CardMedia
                component="img"
                sx={{ width: 160 }}
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Rating value={item.rating} readOnly size="small" />
                      <Chip label={item.prepTime} size="small" variant="outlined" />
                      {item.isVegetarian && <Chip label="Végétarien" size="small" color="success" />}
                      {item.isSpicy && <Chip label="Épicé" size="small" color="error" />}
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {item.price}€
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.calories}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                      {quantities[item.id] || 0}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={!quantities[item.id]}
                    >
                      Ajouter
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Menu;