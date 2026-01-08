// src/pages/AdminUsers.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Divider,
  FormControl,
  CircularProgress,
  Snackbar,
  InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

const roles = [
  { value: "ADMIN", label: "Administrateur", icon: <AdminPanelSettingsIcon />, color: "error" },
  { value: "CHEF", label: "Cuisinier", icon: <RestaurantIcon />, color: "warning" },
  { value: "DRIVER", label: "Livreur", icon: <LocalShippingIcon />, color: "info" }
];

const statuses = [
  { value: "ACTIF", label: "Actif", color: "success" },
  { value: "INACTIF", label: "Inactif", color: "default" }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newUser, setNewUser] = useState({ 
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "CHEF"
  });
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showInactive, setShowInactive] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des utilisateurs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Créer un nouvel utilisateur
  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        severity: 'warning'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const data = await response.json();
      setUsers([...users, data]);
      setNewUser({ 
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        role: "CHEF"
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Utilisateur créé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${editId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === editId ? updatedUser : user));
      setEditId(null);
      setSnackbar({
        open: true,
        message: 'Utilisateur modifié avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      setUsers(users.filter(user => user.id !== deleteId));
      setDeleteId(null);
      setSnackbar({
        open: true,
        message: 'Utilisateur supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 0) return matchesSearch;
    if (activeTab === 1) return user.role === 'ADMIN' && matchesSearch;
    if (activeTab === 2) return user.role === 'CHEF' && matchesSearch;
    if (activeTab === 3) return user.role === 'DRIVER' && matchesSearch;
    return matchesSearch;
  });

  const activeUsers = users.filter(user => user.role !== 'INACTIF').length;
  const roleCounts = roles.reduce((acc, role) => {
    acc[role.value] = users.filter(user => user.role === role.value).length;
    return acc;
  }, {});

  const getRoleIcon = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.icon : <PersonIcon />;
  };

  const getRoleColor = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.color : "default";
  };

  const getAvatarColor = (name) => {
    const colors = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f", "#0288d1"];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            👥 Gestion des utilisateurs (Staff)
          </Typography>
          <Typography color="text.secondary">
            Gérez les administrateurs, cuisiniers et livreurs
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          size="large"
        >
          Nouvel utilisateur
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total staff
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {users.length}
                </Typography>
              </Box>
              <PersonIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Administrateurs
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.ADMIN || 0}
                </Typography>
              </Box>
              <AdminPanelSettingsIcon sx={{ color: 'error.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cuisiniers
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.CHEF || 0}
                </Typography>
              </Box>
              <RestaurantIcon sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Livreurs
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.DRIVER || 0}
                </Typography>
              </Box>
              <LocalShippingIcon sx={{ color: 'info.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Tous" />
                <Tab label="Administrateurs" />
                <Tab label="Cuisiniers" />
                <Tab label="Livreurs" />
              </Tabs>
              
              <Tooltip title="Actualiser">
                <IconButton onClick={fetchUsers}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Utilisateur</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Rôle</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Date de création</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Aucun utilisateur trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    {/* Informations utilisateur */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: getAvatarColor(user.fullName) }}>
                          {user.fullName?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold">{user.fullName}</Typography>
                          <Typography variant="caption" color="text.secondary" hidden>
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    {/* Rôle */}
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={roles.find(r => r.value === user.role)?.label || user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    {/* Contact */}
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </Box>
                        {user.phoneNumber && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {user.phoneNumber}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    
                    {/* Date (simulée) */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {new Date().toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setEditId(user.id);
                              setEditData({ 
                                fullName: user.fullName,
                                email: user.email,
                                phoneNumber: user.phoneNumber || '',
                                role: user.role,
                                password: '' // Champ vide pour la modification
                              });
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue de modification */}
      {editId && (
        <Card sx={{ mt: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ✏️ Modification de l'utilisateur
              </Typography>
              <IconButton onClick={() => setEditId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom complet *"
                  value={editData.fullName || ''}
                  onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={editData.phoneNumber || ''}
                  onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Rôle *
                  </Typography>
                  <Select
                    value={editData.role || 'CHEF'}
                    onChange={(e) => setEditData({...editData, role: e.target.value})}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {role.icon}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe (laisser vide pour ne pas changer)"
                  type="password"
                  value={editData.password || ''}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                  margin="normal"
                  helperText="Minimum 6 caractères"
                />
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={() => setEditId(null)} variant="outlined">
                Annuler
              </Button>
              <Button onClick={handleUpdateUser} variant="contained" startIcon={<SaveIcon />}>
                Sauvegarder
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogue pour nouvel utilisateur */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nouvel utilisateur (Staff)
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet *"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe *"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                margin="normal"
                required
                helperText="Minimum 6 caractères"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Rôle *
                </Typography>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {role.icon}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Cet utilisateur pourra se connecter immédiatement avec ces identifiants.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={!newUser.fullName || !newUser.email || !newUser.password}
          >
            Créer l'utilisateur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Supprimer l'utilisateur
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Êtes-vous sûr de vouloir supprimer l'utilisateur ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette action est irréversible. L'utilisateur perdra immédiatement l'accès.
          </Typography>
          
          {users.find(u => u.id === deleteId)?.role === "ADMIN" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Cet utilisateur est administrateur.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>
            Annuler
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDeleteUser}
            startIcon={<DeleteIcon />}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Guide des rôles */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          📋 Rôles disponibles
        </Typography>
        <Grid container spacing={2}>
          {roles.map((role) => (
            <Grid item xs={12} sm={4} key={role.value}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {role.icon}
                  <Typography fontWeight="bold">{role.label}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  {role.value === "ADMIN" && "Accès complet à toutes les fonctionnalités"}
                  {role.value === "CHEF" && "Gestion de la cuisine et préparation des commandes"}
                  {role.value === "DRIVER" && "Gestion des livraisons et suivi"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsers;