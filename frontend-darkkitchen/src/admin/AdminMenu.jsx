import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Avatar,
  Tooltip,
  CircularProgress,
  Snackbar
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Restaurant,
  Star,
  AccessTime,
  Search,
  FilterList,
  Image as ImageIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const AdminMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDish, setCurrentDish] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    prepTime: "15-20",
    image: "",
    rating: 4.0,
    isPopular: false,
    isNew: false
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");

  // Configuration axios
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Récupérer les plats et catégories depuis l'API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les plats
      const dishesResponse = await axiosInstance.get("/api/dishes");
      
      // Récupérer les catégories
      const categoriesResponse = await axiosInstance.get("/api/categories");
      setCategories(categoriesResponse.data);
      
      // Transformer les données des plats (UNIQUEMENT les champs qui existent dans la base)
      const transformedDishes = dishesResponse.data.map(dish => {
        return {
          id: dish.id,
          name: dish.name,
          price: dish.price || 0,
          description: dish.description || "",
          category: dish.category ? dish.category.name : "Non catégorisé",
          categoryId: dish.category ? dish.category.id : null,
          preparationTime: dish.prepTime ? `${dish.prepTime} min` : "15-20 min",
          rating: dish.rating || 4.0,
          image: dish.image || `/images/dishes/${dish.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          isPopular: dish.isPopular || false,
          isNew: dish.isNew || false
          // SUPPRIMÉ: isAvailable, sales, cost, profit, ingredients, lastOrder
        };
      });
      
      setDishes(transformedDishes);
      setError(null);
    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError(`Impossible de charger les données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'image - Conserver le nom original
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name); // Conserver le nom du fichier
      
      // Créer un aperçu local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Générer un nom d'image basé sur le nom du plat ou le nom du fichier
      const imageName = currentDish.name 
        ? `${currentDish.name.toLowerCase().replace(/\s+/g, '-')}.${file.name.split('.').pop()}`
        : file.name;
      
      setCurrentDish(prev => ({
        ...prev,
        image: `/images/dishes/${imageName}`
      }));
    }
  };

  // Générer l'URL de l'image avec le nom original
  const getImageUrl = () => {
    if (imageFile) {
      // Utiliser le nom original du fichier ou générer un nom basé sur le plat
      const originalName = imageFile.name;
      const extension = originalName.split('.').pop();
      
      // Si un nom de plat est fourni, l'utiliser pour nommer l'image
      if (currentDish.name && currentDish.name.trim() !== "") {
        const dishName = currentDish.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');
        return `/images/dishes/${dishName}.${extension}`;
      }
      
      // Sinon utiliser le nom original du fichier
      return `/images/dishes/${originalName}`;
    }
    
    // Si pas de fichier mais un nom de plat existe, générer une URL
    if (currentDish.name && currentDish.name.trim() !== "") {
      const dishName = currentDish.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      return `/images/dishes/${dishName}.png`;
    }
    
    // Fallback par défaut
    return currentDish.image || "";
  };

  // Ajouter un plat
  const handleAdd = async () => {
    try {
      // Générer l'URL de l'image avec le nom original
      const imageUrl = getImageUrl();
      
      const dishData = {
        name: currentDish.name,
        description: currentDish.description,
        price: parseFloat(currentDish.price),
        image: imageUrl,
        prepTime: currentDish.prepTime || "15-20",
        rating: currentDish.rating || 4.0,
        isPopular: currentDish.isPopular || false,
        isNew: currentDish.isNew || false,
        category: { id: parseInt(currentDish.categoryId) }
      };

      console.log("Création du plat avec données:", dishData);
      
      const response = await axiosInstance.post("/api/dishes", dishData);
      console.log("Plat créé avec succès:", response.data);
      
      // Rafraîchir les données
      await fetchData();
      
      resetForm();
      setOpenDialog(false);
      setSuccessMessage(`Plat "${currentDish.name}" créé avec succès !`);
    } catch (err) {
      console.error("Erreur complète:", err);
      setError(`Erreur lors de la création: ${err.response?.data?.message || err.message}`);
    }
  };

  // Modifier un plat
  const handleUpdate = async () => {
    try {
      const imageUrl = getImageUrl();
      
      const dishData = {
        name: currentDish.name,
        description: currentDish.description,
        price: parseFloat(currentDish.price),
        image: imageUrl,
        prepTime: currentDish.prepTime,
        rating: currentDish.rating,
        isPopular: currentDish.isPopular,
        isNew: currentDish.isNew,
        category: { id: parseInt(currentDish.categoryId) }
      };

      console.log("Mise à jour du plat", currentDish.id, "avec données:", dishData);
      
      const response = await axiosInstance.put(`/api/dishes/${currentDish.id}`, dishData);
      console.log("Réponse mise à jour:", response.data);
      
      // Rafraîchir les données
      await fetchData();
      
      resetForm();
      setOpenDialog(false);
      setSuccessMessage(`Plat "${currentDish.name}" mis à jour avec succès !`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError(`Erreur lors de la mise à jour: ${err.response?.data?.message || err.message}`);
    }
  };

  // Supprimer un plat
  const handleDelete = async (id) => {
    const dishToDelete = dishes.find(d => d.id === id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le plat "${dishToDelete?.name}" ?`)) {
      try {
        await axiosInstance.delete(`/api/dishes/${id}`);
        
        // Rafraîchir les données
        await fetchData();
        
        setSuccessMessage(`Plat "${dishToDelete?.name}" supprimé avec succès !`);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCurrentDish({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      prepTime: "15-20",
      image: "",
      rating: 4.0,
      isPopular: false,
      isNew: false
    });
    setImageFile(null);
    setImagePreview("");
    setFileName("");
  };

  // Ouvrir le dialogue d'édition
  const openEditDialog = (dish) => {
    setCurrentDish({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      categoryId: dish.categoryId || "",
      prepTime: dish.preparationTime.replace(" min", "").split("-")[0] || "15",
      image: dish.image,
      rating: dish.rating,
      isPopular: dish.isPopular,
      isNew: dish.isNew
    });
    setImagePreview(dish.image);
    setFileName(dish.image ? dish.image.split('/').pop() : "");
    setEditMode(true);
    setOpenDialog(true);
  };

  // Ouvrir le dialogue d'ajout
  const openAddDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(true);
  };

  // Filtrer les plats
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcul des statistiques SIMPLIFIÉES (uniquement ce qui existe dans la base)
  const totalDishes = dishes.length;
  const popularDishes = dishes.filter(d => d.isPopular).length;
  const newDishes = dishes.filter(d => d.isNew).length;
  const averageRating = dishes.length > 0 
    ? (dishes.reduce((sum, dish) => sum + dish.rating, 0) / dishes.length).toFixed(1)
    : 0;

  // Catégories uniques pour le filtre
  const uniqueCategories = ["Tous", ...new Set(dishes.map(d => d.category).filter(Boolean))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Chargement du menu...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Notifications */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header avec stats */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📋 Gestion du menu
          </Typography>
          <Typography color="text.secondary">
            {dishes.length} plats disponibles dans votre menu
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openAddDialog}
          size="large"
        >
          Nouveau plat
        </Button>
      </Box>

      {/* Statistiques rapides SIMPLIFIÉES */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total plats
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalDishes}
                </Typography>
              </Box>
              <Restaurant sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Plats populaires
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {popularDishes}
                </Typography>
              </Box>
              <Star sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Nouveautés
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {newDishes}
                </Typography>
              </Box>
              <Star sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Note moyenne
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {averageRating}/5
                </Typography>
              </Box>
              <Star sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                {uniqueCategories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tous");
              }}
            >
              Réinitialiser
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={openAddDialog}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des plats SIMPLIFIÉ */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Image</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Plat</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Catégorie</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Prix (€)</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Temps</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Note</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Statut</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {filteredDishes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {dishes.length === 0 ? "Aucun plat dans le menu" : "Aucun plat trouvé avec ces critères"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDishes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dish) => (
                    <TableRow key={dish.id} hover>
                      {/* Image */}
                      <TableCell>
                        <Avatar
                          src={dish.image}
                          alt={dish.name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            border: '1px solid #ddd',
                            bgcolor: 'grey.100'
                          }}
                          variant="rounded"
                        >
                          {!dish.image && <Restaurant />}
                        </Avatar>
                      </TableCell>
                      
                      {/* Nom et description */}
                      <TableCell>
                        <Box>
                          <Typography fontWeight="bold">{dish.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dish.description.length > 50 
                              ? `${dish.description.substring(0, 50)}...` 
                              : dish.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
                            {dish.preparationTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Catégorie */}
                      <TableCell>
                        <Chip 
                          label={dish.category} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      
                      {/* Prix */}
                      <TableCell align="right">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {dish.price.toFixed(2)}€
                        </Typography>
                      </TableCell>
                      
                      {/* Temps de préparation */}
                      <TableCell align="center">
                        <Typography variant="body2">
                          {dish.preparationTime}
                        </Typography>
                      </TableCell>
                      
                      {/* Note */}
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          <Rating
                            value={dish.rating}
                            size="small"
                            readOnly
                            precision={0.5}
                          />
                          <Typography variant="body2">
                            {dish.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Statut (uniquement isPopular et isNew) */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          {dish.isPopular && (
                            <Tooltip title="Populaire">
                              <Chip 
                                label="Pop" 
                                size="small" 
                                color="warning"
                              />
                            </Tooltip>
                          )}
                          {dish.isNew && (
                            <Tooltip title="Nouveau">
                              <Chip 
                                label="New" 
                                size="small" 
                                color="success"
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openEditDialog(dish)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(dish.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredDishes.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDishes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Plats par page:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} sur ${count} plats`
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogue CRUD - GARDÉ INTACT */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Modifier le plat" : "Ajouter un nouveau plat"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Colonne gauche - Image (GARDÉ INTACT) */}
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Image du plat
                  {fileName && (
                    <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                      ({fileName})
                    </Typography>
                  )}
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #ddd',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  
                  {imagePreview || currentDish.image ? (
                    <Box
                      component="img"
                      src={imagePreview || currentDish.image}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="%23ccc" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
                      }}
                    />
                  ) : (
                    <Box py={4}>
                      <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        Cliquez pour ajouter une image
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PNG, JPG, GIF • Max 5MB
                      </Typography>
                    </Box>
                  )}
                  
                  {currentDish.name && !imageFile && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      L'image sera enregistrée sous: 
                      <br />
                      <strong>/images/dishes/{currentDish.name.toLowerCase().replace(/\s+/g, '-')}.png</strong>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            
            {/* Colonne droite - Formulaire (GARDÉ INTACT) */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom du plat *"
                    value={currentDish.name}
                    onChange={(e) => setCurrentDish({...currentDish, name: e.target.value})}
                    margin="normal"
                    required
                    helperText="Ce nom sera utilisé pour générer le nom de l'image"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Prix (€) *"
                    type="number"
                    value={currentDish.price}
                    onChange={(e) => setCurrentDish({...currentDish, price: e.target.value})}
                    margin="normal"
                    required
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Temps de préparation"
                    value={currentDish.prepTime}
                    onChange={(e) => setCurrentDish({...currentDish, prepTime: e.target.value})}
                    margin="normal"
                    placeholder="ex: 15-20"
                    helperText="Format: 15-20 (minutes)"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Catégorie *</InputLabel>
                    <Select
                      value={currentDish.categoryId}
                      onChange={(e) => setCurrentDish({...currentDish, categoryId: e.target.value})}
                      label="Catégorie *"
                      required
                    >
                      <MenuItem value="">Sélectionnez une catégorie</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={currentDish.description}
                    onChange={(e) => setCurrentDish({...currentDish, description: e.target.value})}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={currentDish.isPopular}
                        onChange={(e) => setCurrentDish({...currentDish, isPopular: e.target.checked})}
                      />
                    }
                    label="Plat populaire"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={currentDish.isNew}
                        onChange={(e) => setCurrentDish({...currentDish, isNew: e.target.checked})}
                      />
                    }
                    label="Nouveau plat"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">Note:</Typography>
                    <Rating
                      value={currentDish.rating}
                      onChange={(event, newValue) => {
                        setCurrentDish({...currentDish, rating: newValue});
                      }}
                      precision={0.5}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({currentDish.rating}/5)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained"
            onClick={editMode ? handleUpdate : handleAdd}
            disabled={!currentDish.name || !currentDish.price || !currentDish.categoryId}
          >
            {editMode ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Composant Rating personnalisé
const Rating = ({ value, size = "medium", readOnly = true, precision = 0.5, onChange }) => {
  const stars = [];
  const starSize = size === "small" ? 20 : 24;
  
  for (let i = 1; i <= 5; i++) {
    const filled = value >= i;
    const halfFilled = value >= i - 0.5 && value < i;
    
    stars.push(
      <Star
        key={i}
        sx={{
          fontSize: starSize,
          color: filled ? '#ffb400' : halfFilled ? '#ffb400' : '#ddd',
          cursor: readOnly ? 'default' : 'pointer',
        }}
        onClick={() => !readOnly && onChange && onChange(null, i)}
      />
    );
  }
  
  return <Box display="flex">{stars}</Box>;
};

export default AdminMenu;