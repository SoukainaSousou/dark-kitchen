// src/pages/Menu.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les plats et les catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const dishesResponse = await fetch('http://localhost:8080/api/dishes');
        if (!dishesResponse.ok) throw new Error('Erreur HTTP pour les plats');
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);

        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        if (!categoriesResponse.ok) throw new Error('Erreur HTTP pour les catégories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le menu. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
  }, [searchParams]);

  // Préparer les tabs
  const categoryTabs = [
    { id: 'all', name: 'Tout le Menu', label: 'Tout le Menu' },
    ...categories.map(cat => ({ id: cat.id.toString(), name: cat.name, label: cat.name }))
  ];

  // Filtrer les plats
  const filteredItems = dishes.filter(item => {
    const categoryMatch = selectedCategory === 'all' || (item.category && item.category.id.toString() === selectedCategory);
    const searchMatch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) + change) }));
  };

  const handleAddToCart = (dish) => {
    const quantity = quantities[dish.id] || 1;
    alert(`${quantity} ${dish.name}(s) ajouté(s) au panier!`);
    setQuantities(prev => ({ ...prev, [dish.id]: 0 }));
  };

  // Gestion de l'upload image
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      handleImageSearch(e.target.files[0]);
    }
  };

const handleImageSearch = async (file) => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      'http://localhost:8080/api/dishes/search-by-image',
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche par image');
    }

    const data = await response.json();

    // ✅ results contient déjà des plats complets
    const foundDishes = Array.isArray(data.results) ? data.results : [];

    if (foundDishes.length === 0) {
      alert(`❌ Aucun plat trouvé pour la catégorie "${data.detected_category}"`);
      return;
    }

    // Mise à jour du menu
    setDishes(foundDishes);
    setSelectedCategory('all');
    setSearchTerm('');


    alert(
      `✅ ${foundDishes.length} plat(s) trouvé(s) pour "${data.detected_category}"`
    );

  } catch (err) {
    console.error(err);
    alert('❌ Erreur lors de la recherche par image');
  } finally {
    setLoading(false);
  }
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
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>Réessayer</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.main">
          Notre Menu Complet
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {dishes.length} plats disponibles • {categories.length} catégories
        </Typography>
      </Box>

      {/* Recherche texte + image */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un plat, une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<ImageSearchIcon />}
          sx={{ height: 56 }}
        >
          Rechercher par image
          <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
        </Button>
      </Box>

      {/* Tabs catégories */}
      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
      >
        {categoryTabs.map(category => (
          <Tab key={category.id} value={category.id} label={category.label} sx={{ fontWeight: selectedCategory === category.id ? 'bold' : 'normal', fontSize: '0.95rem' }} />
        ))}
      </Tabs>

      {/* Message si aucun plat */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : 'Aucun plat trouvé dans cette catégorie'}
          </Typography>
          <Button variant="outlined" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}>Voir tout le menu</Button>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filteredItems.length} plat{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
          </Typography>

          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                      image={item.image || '/images/default-dish.jpg'}
                      alt={item.name}
                    />
                    <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 1 }}>
                      {item.popular && <Chip label="Populaire" size="small" color="secondary" sx={{ fontWeight: 'bold' }} />}
                      {item.isNewDish && <Chip label="Nouveau" size="small" color="primary" sx={{ fontWeight: 'bold' }} />}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1.3, flex: 1, mr: 1 }}>{item.name}</Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>{item.price?.toFixed(2) || '0.00'}€</Typography>
                    </Box>
                    {item.category && <Chip label={item.category.name} size="small" sx={{ mb: 1.5, backgroundColor: 'primary.light', color: 'white', fontWeight: 'medium', alignSelf: 'flex-start' }} />}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1, lineHeight: 1.5, minHeight: 40 }}>{item.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">{item.prepTime || '20-25 min'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={item.rating || 0} readOnly size="small" precision={0.5} />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>({item.rating?.toFixed(1) || '0.0'})</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)} sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'action.hover' } }}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography variant="body1" sx={{ minWidth: 32, textAlign: 'center', fontWeight: 'medium', fontSize: '1.1rem' }}>{quantities[item.id] || 0}</Typography>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)} sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'action.hover' } }}><AddIcon fontSize="small" /></IconButton>
                      </Box>
                      <Button variant="contained" onClick={() => handleAddToCart(item)} disabled={!(quantities[item.id] > 0)} sx={{ minWidth: 120, borderRadius: 1.5, textTransform: 'none', fontWeight: 'bold', px: 3, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, '&:disabled': { backgroundColor: 'action.disabled' } }}>{quantities[item.id] > 0 ? `Ajouter (${quantities[item.id]})` : 'Ajouter au panier'}</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Menu;
