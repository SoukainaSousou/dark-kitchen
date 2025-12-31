import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Badge,
  CircularProgress,
  Snackbar
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import TrendingUp from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarningIcon from "@mui/icons-material/Warning";

const API_URL = "http://localhost:8080/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📋",
    isActive: true
  });

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [showInactive, setShowInactive] = useState(false);

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      // Transformer les données de l'API pour inclure les propriétés nécessaires
      const transformedCategories = response.data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || "",
        icon: category.icon || getDefaultIcon(category.name),
        isActive: true, // Par défaut, toutes les catégories sont actives
        dishCount: category.dishes ? category.dishes.length : 0,
        totalSales: calculateTotalSales(category.dishes || []),
        lastUpdated: new Date().toISOString().split('T')[0], // À remplacer par une date réelle si disponible
        color: getRandomColor()
      }));
      setCategories(transformedCategories);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories:", err);
      setError("Impossible de charger les catégories. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Calculer les ventes totales pour une catégorie
  const calculateTotalSales = (dishes) => {
    // Cette fonction devrait utiliser les données réelles de vente
    // Pour l'instant, on retourne une valeur aléatoire pour la démo
    return Math.floor(Math.random() * 500);
  };

  // Obtenir une icône par défaut basée sur le nom de la catégorie
  const getDefaultIcon = (categoryName) => {
    const iconMap = {
      "Burger": "🍔",
      "Pizza": "🍕",
      "Salades": "🥗",
      "Bowls": "🥗",
      "pâtes": "🍝",
      "desserts": "🍰",
      "boissons": "🥤",
      "café": "☕",
      "sushis": "🍣",
      "tacos": "🌯",
      "plats": "🥘",
      "nouilles": "🍜",
      "viennoiseries": "🥐"
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return "📋";
  };

  // Ajouter une catégorie
  const handleAdd = async () => {
    if (!newCategory.name.trim()) return;
    
    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon
      };

      const response = await axios.post(`${API_URL}/categories`, categoryData);
      
      // Ajouter la nouvelle catégorie avec les propriétés calculées
      const newCat = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description || "",
        icon: response.data.icon || newCategory.icon,
        isActive: newCategory.isActive,
        dishCount: 0,
        totalSales: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        color: getRandomColor()
      };
      
      setCategories([...categories, newCat]);
      setNewCategory({
        name: "",
        description: "",
        icon: "📋",
        isActive: true
      });
      setOpenDialog(false);
      setSuccessMessage("Catégorie créée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la création de la catégorie:", err);
      setError("Erreur lors de la création de la catégorie.");
    }
  };

  // Éditer une catégorie
  const startEdit = (category) => {
    setEditId(category.id);
    setEditValue({ ...category });
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        name: editValue.name,
        description: editValue.description,
        icon: editValue.icon
      };

      await axios.put(`${API_URL}/categories/${editId}`, updateData);
      
      // Mettre à jour localement
      setCategories(categories.map(cat => 
        cat.id === editId 
          ? { ...editValue, lastUpdated: new Date().toISOString().split('T')[0] }
          : cat
      ));
      setEditId(null);
      setSuccessMessage("Catégorie mise à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la catégorie:", err);
      setError("Erreur lors de la mise à jour de la catégorie.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Les plats associés deviendront 'Non catégorisés'.")) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
        setSuccessMessage("Catégorie supprimée avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression de la catégorie:", err);
        setError("Erreur lors de la suppression de la catégorie.");
      }
    }
  };

  // Activer/désactiver une catégorie
  const toggleActive = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, isActive: !cat.isActive, lastUpdated: new Date().toISOString().split('T')[0] }
        : cat
    ));
  };

  // Calculer les statistiques
  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalDishes = categories.reduce((sum, cat) => sum + cat.dishCount, 0);
  const totalSales = categories.reduce((sum, cat) => sum + cat.totalSales, 0);
  const mostPopularCategory = categories.length > 0 
    ? categories.reduce((max, cat) => cat.totalSales > max.totalSales ? cat : max, categories[0])
    : null;

  const filteredCategories = showInactive 
    ? categories 
    : categories.filter(cat => cat.isActive);

  // Fonction utilitaire pour couleur aléatoire
  const getRandomColor = () => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", 
      "#118AB2", "#EF476F", "#7209B7", "#3A86FF"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Icônes disponibles
  const availableIcons = ["🍔", "🍕", "🥗", "🍝", "🍰", "🥤", "☕", "🍣", "🌯", "🥘", "🍜", "🧁", "🍩", "🍦"];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Notifications */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
        color="error"
      />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🏷️ Gestion des catégories
          </Typography>
          <Typography color="text.secondary">
            Organisez votre menu par catégories pour une meilleure navigation
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={viewMode === "cards" ? <VisibilityIcon /> : <VisibilityOffIcon />}
            onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
          >
            {viewMode === "cards" ? "Vue tableau" : "Vue cartes"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nouvelle catégorie
          </Button>
        </Stack>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Catégories actives
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {activeCategories}/{categories.length}
                </Typography>
              </Box>
              <CategoryIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
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
              <RestaurantIcon sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total ventes
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {totalSales}
                </Typography>
              </Box>
              <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Plus populaire
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {mostPopularCategory ? `${mostPopularCategory.icon} ${mostPopularCategory.name}` : "Aucune"}
                </Typography>
              </Box>
              <LocalFireDepartment sx={{ color: 'error.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertes */}
      {categories.filter(cat => !cat.isActive).length > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? "Masquer inactives" : "Voir inactives"}
            </Button>
          }
        >
          {categories.filter(cat => !cat.isActive).length} catégorie(s) inactive(s)
        </Alert>
      )}

      {/* Vue Tableau */}
      {viewMode === "table" ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Catégorie</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Statut</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Plats</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Ventes</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Mise à jour</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow 
                      key={category.id}
                      hover
                      sx={{ opacity: category.isActive ? 1 : 0.7 }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: category.color, width: 40, height: 40 }}>
                            <Typography variant="h6">{category.icon}</Typography>
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">{category.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {category.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {category.description}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title={category.isActive ? "Active" : "Inactive"}>
                          <Chip
                            label={category.isActive ? "Active" : "Inactive"}
                            color={category.isActive ? "success" : "default"}
                            size="small"
                            onClick={() => toggleActive(category.id)}
                          />
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Badge badgeContent={category.dishCount} color="primary">
                          <RestaurantIcon color="action" />
                        </Badge>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          <ShoppingCartIcon fontSize="small" color="action" />
                          <Typography fontWeight="medium">
                            {category.totalSales}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="caption">
                          {category.lastUpdated}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => startEdit(category)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(category.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        /* Vue Cartes */
        <Grid container spacing={3}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: category.isActive ? 1 : 0.7,
                  borderLeft: `4px solid ${category.color}`
                }}
              >
                <CardContent>
                  {/* En-tête */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: category.color, width: 50, height: 50 }}>
                        <Typography variant="h5">{category.icon}</Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {category.name}
                        </Typography>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          color={category.isActive ? "success" : "default"}
                          size="small"
                          onClick={() => toggleActive(category.id)}
                        />
                      </Box>
                    </Box>
                    
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => startEdit(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>

                  {/* Statistiques */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">
                        Plats
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {category.dishCount}
                      </Typography>
                    </Box>
                    
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary">
                        Ventes
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {category.totalSales}
                      </Typography>
                    </Box>
                    
                    <Box textAlign="center">
                      <Typography variant="caption" color="text-secondary">
                        Mise à jour
                      </Typography>
                      <Typography variant="body2">
                        {category.lastUpdated}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      ID: {category.id}
                    </Typography>
                    
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {/* Naviguer vers les plats de cette catégorie */}}
                    >
                      Voir les plats
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mode édition */}
      {editId && (
        <Card sx={{ mt: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ✏️ Modification de la catégorie
              </Typography>
              <IconButton onClick={cancelEdit}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nom de la catégorie"
                  value={editValue.name}
                  onChange={(e) => setEditValue({...editValue, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editValue.description}
                  onChange={(e) => setEditValue({...editValue, description: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Icône"
                  value={editValue.icon}
                  onChange={(e) => setEditValue({...editValue, icon: e.target.value})}
                  helperText="Emoji"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editValue.isActive}
                      onChange={(e) => setEditValue({...editValue, isActive: e.target.checked})}
                    />
                  }
                  label="Catégorie active"
                />
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={cancelEdit} variant="outlined">
                Annuler
              </Button>
              <Button onClick={saveEdit} variant="contained" startIcon={<SaveIcon />}>
                Sauvegarder
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogue pour nouvelle catégorie */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nouvelle catégorie
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la catégorie"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Choix de l'icône :
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {availableIcons.map((icon, index) => (
                  <IconButton
                    key={index}
                    onClick={() => setNewCategory({...newCategory, icon})}
                    sx={{ 
                      border: newCategory.icon === icon ? '2px solid' : '1px solid',
                      borderColor: newCategory.icon === icon ? 'primary.main' : 'divider'
                    }}
                  >
                    <Typography variant="h5">{icon}</Typography>
                  </IconButton>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCategory.isActive}
                    onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
                  />
                }
                label="Activer immédiatement"
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
            onClick={handleAdd}
            disabled={!newCategory.name.trim()}
          >
            Créer la catégorie
          </Button>
        </DialogActions>
      </Dialog>

      {/* Liste des icônes disponibles */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          💡 Bonnes pratiques pour les catégories :
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Limitez à 6-8 catégories maximum pour une navigation simple<br/>
          2. Utilisez des noms courts et descriptifs<br/>
          3. Assurez-vous que chaque catégorie contient au moins 3 plats<br/>
          4. Désactivez plutôt que supprimez pour garder l'historique<br/>
          5. Regroupez les plats similaires pour faciliter le choix
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminCategories;