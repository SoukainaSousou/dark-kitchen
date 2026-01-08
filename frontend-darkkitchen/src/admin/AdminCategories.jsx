import {
  Box,
  Typography,
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
    icon: "📋"
  });

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories:", err);
      setError("Impossible de charger les catégories. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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
      
      // Ajouter la nouvelle catégorie à la liste
      setCategories([...categories, response.data]);
      setNewCategory({
        name: "",
        description: "",
        icon: "📋"
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
    setEditValue({ 
      name: category.name,
      description: category.description || "",
      icon: category.icon || "📋"
    });
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        name: editValue.name,
        description: editValue.description,
        icon: editValue.icon
      };

      await axios.put(`${API_URL}/categories/${editId}`, updateData);
      
      // Rafraîchir les données
      await fetchCategories();
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
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

  // Calculer le nombre de plats par catégorie
  const getDishCount = (category) => {
    return category.dishes ? category.dishes.length : 0;
  };

  // Fonction utilitaire pour couleur aléatoire (pour les avatars)
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
            Organisez votre menu par catégories
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant={viewMode === "cards" ? "contained" : "outlined"}
            onClick={() => setViewMode("cards")}
          >
            Vue cartes
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            onClick={() => setViewMode("table")}
          >
            Vue tableau
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
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total catégories
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {categories.length}
                </Typography>
              </Box>
              <CategoryIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total plats
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {categories.reduce((sum, cat) => sum + getDishCount(cat), 0)}
                </Typography>
              </Box>
              <RestaurantIcon sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Catégories sans plats
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {categories.filter(cat => getDishCount(cat) === 0).length}
                </Typography>
              </Box>
              <WarningIcon sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
                    <TableCell align="center"><Typography fontWeight="bold">Plats</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ 
                            bgcolor: getRandomColor(), 
                            width: 40, 
                            height: 40 
                          }}>
                            <Typography variant="h6">{category.icon || "📋"}</Typography>
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">{category.name}</Typography>
                            <Typography variant="caption" color="text.secondary" hidden>
                              ID: {category.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {category.description || "Aucune description"}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Chip
                          label={getDishCount(category)}
                          color={getDishCount(category) > 0 ? "primary" : "default"}
                          size="small"
                        />
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
            
            {categories.length === 0 && (
              <Box py={4} textAlign="center">
                <Typography color="text.secondary">
                  Aucune catégorie trouvée
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Vue Cartes */
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  {/* En-tête */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ 
                        bgcolor: getRandomColor(), 
                        width: 50, 
                        height: 50 
                      }}>
                        <Typography variant="h5">{category.icon || "📋"}</Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {category.name}
                        </Typography>
                        <Chip
                          label={`${getDishCount(category)} plats`}
                          color={getDishCount(category) > 0 ? "primary" : "default"}
                          size="small"
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                    {category.description || "Aucune description"}
                  </Typography>

                  {/* Informations */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
        
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {categories.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucune catégorie disponible
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Commencez par créer votre première catégorie
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Créer une catégorie
                </Button>
              </Paper>
            </Grid>
          )}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom de la catégorie *"
                  value={editValue.name}
                  onChange={(e) => setEditValue({...editValue, name: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editValue.description}
                  onChange={(e) => setEditValue({...editValue, description: e.target.value})}
                  margin="normal"
                  multiline
                  rows={3}
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
                      onClick={() => setEditValue({...editValue, icon})}
                      sx={{ 
                        border: editValue.icon === icon ? '2px solid' : '1px solid',
                        borderColor: editValue.icon === icon ? 'primary.main' : 'divider'
                      }}
                    >
                      <Typography variant="h5">{icon}</Typography>
                    </IconButton>
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={cancelEdit} variant="outlined">
                Annuler
              </Button>
              <Button 
                onClick={saveEdit} 
                variant="contained" 
                startIcon={<SaveIcon />}
                disabled={!editValue.name.trim()}
              >
                Sauvegarder
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogue pour nouvelle catégorie */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nouvelle catégorie
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la catégorie *"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                margin="normal"
                required
                error={!newCategory.name.trim()}
                helperText={!newCategory.name.trim() ? "Ce champ est obligatoire" : ""}
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
                rows={3}
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
    </Box>
  );
};

export default AdminCategories;