// src/pages/AdminProfil.js
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
  Snackbar
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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { authService } from "../services/api";

const AdminProfil = () => {
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
  
  // Données du profil utilisateur (staff)
  const [user, setUser] = useState({
    id: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "ADMIN"
  });
  
  // Données d'édition
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: ""
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
      
      // Vérifier si c'est un staff (ADMIN, CHEF, DRIVER)
      if (!currentUser.role || !['ADMIN', 'CHEF', 'DRIVER'].includes(currentUser.role)) {
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
      
      setUser({
        id: userData.id,
        fullName: userData.fullName || "Administrateur",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        role: userData.role || "ADMIN"
      });
      
      setEditData({
        fullName: userData.fullName || "Administrateur",
        phoneNumber: userData.phoneNumber || ""
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      
      // En cas d'erreur, utiliser les données locales
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          fullName: currentUser.fullName || "Administrateur",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || "",
          role: currentUser.role || "ADMIN"
        });
        
        setEditData({
          fullName: currentUser.fullName || "Administrateur",
          phoneNumber: currentUser.phoneNumber || ""
        });
      }
      
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement du profil. Utilisation des données locales.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [navigate]);

  // Obtenir la couleur du badge selon le rôle
  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'error';
      case 'CHEF': return 'warning';
      case 'DRIVER': return 'info';
      default: return 'default';
    }
  };

  // Obtenir l'icône du rôle
  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return <AdminPanelSettingsIcon />;
      case 'CHEF': return <RestaurantIcon />;
      case 'DRIVER': return <LocalShippingIcon />;
      default: return <PersonIcon />;
    }
  };

  // Obtenir le libellé du rôle
  const getRoleLabel = (role) => {
    switch(role) {
      case 'ADMIN': return 'Administrateur';
      case 'CHEF': return 'Chef Cuisinier';
      case 'DRIVER': return 'Livreur';
      default: return 'Utilisateur';
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
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updatedUser = await response.json();
      
      // Mettre à jour les données du profil
      setUser({
        ...user,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber
      });
      
      // Mettre à jour dans le localStorage via authService
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUserData = {
          ...currentUser,
          fullName: updatedUser.fullName,
          phoneNumber: updatedUser.phoneNumber
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
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordData.newPassword
          // Note: Votre API actuelle ne vérifie pas le mot de passe actuel
          // Vous devriez ajouter un endpoint spécifique pour changer le mot de passe
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
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
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

  // Déconnexion
  const handleLogout = () => {
    authService.logout();
    navigate('/auth');
  };

  // Obtenir l'initiale pour l'avatar
  const getUserInitial = () => {
    if (!user.fullName) return 'U';
    return user.fullName.charAt(0).toUpperCase();
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
            👤 Mon Profil {getRoleLabel(user.role)}
          </Typography>
          <Typography color="text.secondary">
            Gérez vos informations personnelles et paramètres de sécurité
          </Typography>
        </Box>
        
        <Chip
          icon={getRoleIcon(user.role)}
          label={getRoleLabel(user.role)}
          color={getRoleColor(user.role)}
          size="medium"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Grid container spacing={3}>
      

        {/* Colonne droite: Informations et sécurité */}
        <Grid item xs={12} md={8}>
          {/* Carte Informations personnelles */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Informations personnelles
                </Typography>
                
                {!editMode ? (
                  <Button
                    variant="outlined"
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
                          <PersonIcon color={editMode ? "primary" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user.email}
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
                          <PhoneIcon color={editMode ? "primary" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              {editMode && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Vos modifications seront sauvegardées sur le serveur.
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
                            <LockIcon color="primary" />
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
                            <LockIcon color="primary" />
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
                            <LockIcon color="primary" />
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
                    Pour des raisons de sécurité, il est recommandé de changer votre mot de passe régulièrement.
                  </Typography>
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Conseils de sécurité :
                    </Typography>
                    <Typography variant="body2">
                      • Utilisez un mot de passe fort avec au moins 6 caractères<br/>
                      • Combinez lettres, chiffres et caractères spéciaux<br/>
                      • Ne réutilisez pas le même mot de passe sur plusieurs sites<br/>
                      • Changez votre mot de passe tous les 3 mois
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

export default AdminProfil;