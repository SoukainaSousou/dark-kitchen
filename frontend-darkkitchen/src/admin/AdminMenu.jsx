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
  Divider,
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
  Badge,
  Rating
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Restaurant,
  LocalFireDepartment,
  Star,
  Visibility,
  VisibilityOff,
  Category,
  AttachMoney,
  AccessTime,
  Warning,
  ShoppingCart,
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Cancel,
  TrendingUp,
  TrendingDown
} from "@mui/icons-material";
import { useState } from "react";

const AdminMenu = () => {
  const [dishes, setDishes] = useState([
    { 
      id: 1, 
      name: "Poulet Teriyaki", 
      price: 14.90,
      description: "Poulet mariné sauce teriyaki, riz basmati et légumes sautés",
      category: "Plats principaux",
      preparationTime: "15-20 min",
      isAvailable: true,
      rating: 4.5,
      sales: 128,
      cost: 5.30,
      profit: 9.60,
      ingredients: ["Poulet", "Sauce teriyaki", "Riz basmati", "Légumes"],
      lastOrder: "2024-01-15 14:30"
    },
    { 
      id: 2, 
      name: "Burger Gourmet", 
      price: 16.50,
      description: "Steak haché 180g, cheddar, bacon croustillant, sauce maison",
      category: "Burgers",
      preparationTime: "12-18 min",
      isAvailable: true,
      rating: 4.8,
      sales: 156,
      cost: 6.20,
      profit: 10.30,
      ingredients: ["Steak haché", "Pain brioché", "Cheddar", "Bacon"],
      lastOrder: "2024-01-15 15:15"
    },
    { 
      id: 3, 
      name: "Salade César", 
      price: 12.90,
      description: "Laitue romaine, croûtons, parmesan, sauce césar maison",
      category: "Salades",
      preparationTime: "8-12 min",
      isAvailable: true,
      rating: 4.3,
      sales: 89,
      cost: 4.50,
      profit: 8.40,
      ingredients: ["Laitue romaine", "Croûtons", "Parmesan", "Poulet"],
      lastOrder: "2024-01-15 12:45"
    },
    { 
      id: 4, 
      name: "Pizza Margherita", 
      price: 13.90,
      description: "Tomates San Marzano, mozzarella di bufala, basilic frais",
      category: "Pizzas",
      preparationTime: "20-25 min",
      isAvailable: false,
      rating: 4.6,
      sales: 102,
      cost: 4.80,
      profit: 9.10,
      ingredients: ["Pâte à pizza", "Tomates", "Mozzarella", "Basilic"],
      lastOrder: "2024-01-14 19:30"
    },
    { 
      id: 5, 
      name: "Pasta Carbonara", 
      price: 15.90,
      description: "Spaghetti, pancetta, œuf, pecorino romano, poivre noir",
      category: "Pâtes",
      preparationTime: "15-18 min",
      isAvailable: true,
      rating: 4.7,
      sales: 94,
      cost: 5.60,
      profit: 10.30,
      ingredients: ["Spaghetti", "Pancetta", "Œufs", "Pecorino"],
      lastOrder: "2024-01-15 13:20"
    },
    { 
      id: 6, 
      name: "Tiramisu", 
      price: 7.90,
      description: "Dessert italien au café, mascarpone et cacao",
      category: "Desserts",
      preparationTime: "5 min",
      isAvailable: true,
      rating: 4.9,
      sales: 67,
      cost: 2.80,
      profit: 5.10,
      ingredients: ["Mascarpone", "Biscuits", "Café", "Cacao"],
      lastOrder: "2024-01-15 16:00"
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const categories = ["Tous", "Plats principaux", "Burgers", "Salades", "Pizzas", "Pâtes", "Desserts", "Boissons"];

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) {
      setDishes(dishes.filter(dish => dish.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setDishes(dishes.map(dish => 
      dish.id === id ? { ...dish, isAvailable: !dish.isAvailable } : dish
    ));
  };

  const handleSubmit = (formData) => {
    if (editMode) {
      setDishes(dishes.map(dish => 
        dish.id === formData.id ? formData : dish
      ));
    } else {
      setDishes([...dishes, { ...formData, id: dishes.length + 1 }]);
    }
    setOpenDialog(false);
    setCurrentDish(null);
  };

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

  const totalRevenue = dishes.reduce((sum, dish) => sum + (dish.price * dish.sales), 0).toFixed(2);
  const totalProfit = dishes.reduce((sum, dish) => sum + (dish.profit * dish.sales), 0).toFixed(2);
  const availableDishes = dishes.filter(d => d.isAvailable).length;

  const getPopularityColor = (sales) => {
    if (sales > 120) return "error";
    if (sales > 80) return "warning";
    return "default";
  };

  const getProfitMargin = (dish) => {
    return ((dish.profit / dish.price) * 100).toFixed(1);
  };

  return (
    <Box>
      {/* Header avec stats */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📋 Gestion du menu
          </Typography>
          <Typography color="text.secondary">
            Tableau de bord complet des plats et de leur performance
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditMode(false);
            setCurrentDish(null);
            setOpenDialog(true);
          }}
          size="large"
        >
          Nouveau plat
        </Button>
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Plats disponibles
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {availableDishes}/{dishes.length}
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
                  Revenus totaux
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {totalRevenue}€
                </Typography>
              </Box>
              <AttachMoney sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Profit total
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {totalProfit}€
                </Typography>
              </Box>
              <TrendingUp sx={{ color: 'success.main', fontSize: 40 }} />
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
                  {(dishes.reduce((sum, dish) => sum + dish.rating, 0) / dishes.length).toFixed(1)}/5
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
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tous");
              }}
            >
              Réinitialiser filtres
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditMode(false);
                setCurrentDish(null);
                setOpenDialog(true);
              }}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des plats */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Plat</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Catégorie</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Prix</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Disponible</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Ventes</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Note</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Marge</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {filteredDishes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dish) => (
                  <TableRow 
                    key={dish.id}
                    hover
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: dish.isAvailable ? 1 : 0.7
                    }}
                  >
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
                      <Typography variant="caption" color="text.secondary">
                        Coût: {dish.cost.toFixed(2)}€
                      </Typography>
                    </TableCell>
                    
                    {/* Disponibilité */}
                    <TableCell align="center">
                      <Tooltip title={dish.isAvailable ? "Disponible" : "Indisponible"}>
                        <IconButton
                          size="small"
                          onClick={() => toggleAvailability(dish.id)}
                          color={dish.isAvailable ? "success" : "error"}
                        >
                          {dish.isAvailable ? <CheckCircle /> : <Cancel />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    
                    {/* Ventes */}
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        <Badge 
                          badgeContent={dish.sales} 
                          color={getPopularityColor(dish.sales)}
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              fontSize: '0.75rem',
                              height: 20,
                              minWidth: 20 
                            }
                          }}
                        >
                          <ShoppingCart color="action" />
                        </Badge>
                        <Typography fontWeight="medium">
                          {dish.sales}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Note */}
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <Rating value={dish.rating} size="small" readOnly precision={0.5} />
                        <Typography variant="body2">
                          {dish.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Marge */}
                    <TableCell align="right">
                      <Chip
                        label={`${getProfitMargin(dish)}%`}
                        size="small"
                        color={getProfitMargin(dish) > 60 ? "success" : "default"}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Profit: {dish.profit.toFixed(2)}€
                      </Typography>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setCurrentDish(dish);
                              setEditMode(true);
                              setOpenDialog(true);
                            }}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
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
          
          {filteredDishes.length === 0 && (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">
                Aucun plat trouvé avec ces critères
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialogue CRUD */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? "Modifier le plat" : "Ajouter un nouveau plat"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du plat"
                defaultValue={currentDish?.name || ""}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prix (€)"
                type="number"
                defaultValue={currentDish?.price || ""}
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
                label="Coût (€)"
                type="number"
                defaultValue={currentDish?.cost || ""}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  defaultValue={currentDish?.category || ""}
                  label="Catégorie"
                  required
                >
                  {categories.filter(c => c !== "Tous").map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                defaultValue={currentDish?.description || ""}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Temps de préparation"
                defaultValue={currentDish?.preparationTime || ""}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ingrédients principaux"
                defaultValue={currentDish?.ingredients?.join(", ") || ""}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    defaultChecked={currentDish?.isAvailable ?? true} 
                  />
                }
                label="Disponible à la vente"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              // Logique pour sauvegarder
              handleSubmit({
                ...currentDish,
                // Récupérer les valeurs du formulaire ici
              });
            }}
          >
            {editMode ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMenu;