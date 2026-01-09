// src/pages/ChefProfil.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import TodayIcon from "@mui/icons-material/Today";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { authService } from "../services/api";

const ChefProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  
  // Données du profil chef
  const [chef, setChef] = useState({
    id: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "CHEF",
    specialite: "",
    experience: "",
    statut: "ACTIF"
  });
  
  // Statistiques du chef
  const [stats, setStats] = useState({
    commandesJour: 0,
    commandesSemaine: 0,
    tauxPreparation: 95,
    specialitesPreparées: [],
    tempsMoyenPreparation: "25 min"
  });
  
  // Données d'édition
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    specialite: ""
  });
  
  // Données de changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Récupérer les données du profil
  const loadProfileData = async () => {
    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/auth');
        return;
      }
      
      // Vérifier si c'est un chef
      if (!currentUser.role || currentUser.role !== 'CHEF') {
        navigate('/');
        return;
      }
      
      // Récupérer les données complètes du serveur
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }
      
      const userData = await response.json();
      
      setChef({
        id: userData.id,
        fullName: userData.fullName || "Chef Cuisinier",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        role: userData.role || "CHEF",
        specialite: userData.specialite || "Cuisine Française",
        experience: userData.experience || "5 ans",
        statut: userData.statut || "ACTIF"
      });
      
      setEditData({
        fullName: userData.fullName || "Chef Cuisinier",
        phoneNumber: userData.phoneNumber || "",
        specialite: userData.specialite || "Cuisine Française"
      });
      
      // Charger les statistiques du chef (simulées pour l'exemple)
      loadChefStats(currentUser.id);
      
    } catch (error) {
      console.error('Erreur:', error);
      
      // En cas d'erreur, utiliser les données locales
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setChef({
          id: currentUser.id,
          fullName: currentUser.fullName || "Chef Cuisinier",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || "",
          role: currentUser.role || "CHEF",
          specialite: "Cuisine Française",
          experience: "5 ans",
          statut: "ACTIF"
        });
        
        setEditData({
          fullName: currentUser.fullName || "Chef Cuisinier",
          phoneNumber: currentUser.phoneNumber || "",
          specialite: "Cuisine Française"
        });
      }
      
      // Charger des stats par défaut
      setStats({
        commandesJour: 12,
        commandesSemaine: 85,
        tauxPreparation: 95,
        specialitesPreparées: ["Plat du jour", "Menu spécial", "Desserts"],
        tempsMoyenPreparation: "25 min"
      });
      
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement du profil. Utilisation des données locales.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques du chef
  const loadChefStats = async (chefId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/chefs/${chefId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      } else {
        // Stats par défaut si l'API n'est pas disponible
        setStats({
          commandesJour: 12,
          commandesSemaine: 85,
          tauxPreparation: 95,
          specialitesPreparées: ["Plat du jour", "Menu spécial", "Desserts"],
          tempsMoyenPreparation: "25 min"
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [navigate]);

  // Obtenir la couleur du badge selon le statut
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'ACTIF': return 'success';
      case 'EN_PAUSE': return 'warning';
      case 'INACTIF': return 'error';
      default: return 'default';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (statut) => {
    switch(statut) {
      case 'ACTIF': return 'Actif';
      case 'EN_PAUSE': return 'En pause';
      case 'INACTIF': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    if (!editData.fullName.trim()) {
      setSnackbar({
        open: true,
        message: 'Le nom complet est requis',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${chef.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber,
          specialite: editData.specialite
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updatedChef = await response.json();
      
      // Mettre à jour les données du profil
      setChef({
        ...chef,
        fullName: updatedChef.fullName,
        phoneNumber: updatedChef.phoneNumber,
        specialite: updatedChef.specialite || editData.specialite
      });
      
      // Mettre à jour dans le localStorage via authService
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUserData = {
          ...currentUser,
          fullName: updatedChef.fullName,
          phoneNumber: updatedChef.phoneNumber
        };
        authService.saveUser(updatedUserData);
      }
      
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erreur lors de la mise à jour du profil',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Les mots de passe ne correspondent pas',
        severity: 'error'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Utiliser l'endpoint updateUser avec le mot de passe
      const response = await fetch(`http://localhost:8080/api/users/${chef.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du changement de mot de passe');
      }

      // Réinitialiser les champs
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setPasswordEditMode(false);
      setSnackbar({
        open: true,
        message: 'Mot de passe changé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erreur lors du changement de mot de passe',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditData({
      fullName: chef.fullName,
      phoneNumber: chef.phoneNumber,
      specialite: chef.specialite
    });
    setEditMode(false);
  };

  // Annuler le changement de mot de passe
  const handleCancelPasswordEdit = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordEditMode(false);
  };

  // Obtenir l'initiale pour l'avatar
  const getUserInitial = () => {
    if (!chef.fullName) return 'C';
    return chef.fullName.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            👨‍🍳 Mon Profil Chef
          </Typography>
          <Typography color="text.secondary">
            Gérez vos informations personnelles et suivez vos performances
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Chip
            icon={<RestaurantIcon />}
            label="Chef Cuisinier"
            color="warning"
            size="medium"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label={getStatusLabel(chef.statut)}
            color={getStatusColor(chef.statut)}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
       
        {/* Colonne droite: Informations et sécurité */}
        <Grid item xs={12} md={8}>
          {/* Carte Informations personnelles */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  <LocalDiningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Informations professionnelles
                </Typography>
                
                {!editMode ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Modifier
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={editMode ? "warning" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={chef.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="L'email ne peut pas être modifié"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    value={editData.phoneNumber}
                    onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={editMode ? "warning" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              {editMode && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Vos modifications seront sauvegardées sur le serveur et visibles par l'équipe.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Carte Sécurité */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Sécurité du compte
                </Typography>
                
                {!passwordEditMode ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => setPasswordEditMode(true)}
                  >
                    Changer le mot de passe
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelPasswordEdit}
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      {saving ? 'Changement...' : 'Changer'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              {passwordEditMode ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mot de passe actuel"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="warning" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nouveau mot de passe"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      helperText="Minimum 6 caractères"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="warning" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirmer le nouveau mot de passe"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="warning" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Pour des raisons de sécurité de la cuisine, il est recommandé de changer votre mot de passe régulièrement.
                  </Typography>
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Conseils de sécurité pour chefs :
                    </Typography>
                    <Typography variant="body2">
                      • Utilisez un mot de passe fort et unique<br/>
                      • Ne partagez jamais vos identifiants<br/>
                      • Déconnectez-vous toujours après utilisation<br/>
                      • Signalez toute activité suspecte à l'administrateur
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default ChefProfil;