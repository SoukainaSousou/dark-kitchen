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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TodayIcon from "@mui/icons-material/Today";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import BadgeIcon from "@mui/icons-material/Badge";
import { authService } from "../services/api";

const DriverProfil = () => {
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
  
  // Données du profil chauffeur
  const [driver, setDriver] = useState({
    id: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "DRIVER",
    vehicleType: "",
    licensePlate: "",
    statut: "ACTIF",
    currentLocation: "",
    rating: 4.8
  });
  
  // Statistiques du chauffeur
  const [stats, setStats] = useState({
    livraisonsJour: 0,
    livraisonsSemaine: 0,
    tauxLivraison: 95,
    distanceParcourue: "0 km",
    tempsMoyenLivraison: "25 min",
    evaluationsPositives: 98
  });
  
  // Données d'édition
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    vehicleType: "",
    licensePlate: "",
    currentLocation: ""
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
      
      // Vérifier si c'est un chauffeur
      if (!currentUser.role || currentUser.role !== 'DRIVER') {
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
      
      setDriver({
        id: userData.id,
        fullName: userData.fullName || "Chauffeur",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        role: userData.role || "DRIVER",
        vehicleType: userData.vehicleType || "Voiture",
        licensePlate: userData.licensePlate || "",
        statut: userData.statut || "ACTIF",
        currentLocation: userData.currentLocation || "En attente",
        rating: userData.rating || 4.8
      });
      
      setEditData({
        fullName: userData.fullName || "Chauffeur",
        phoneNumber: userData.phoneNumber || "",
        vehicleType: userData.vehicleType || "Voiture",
        licensePlate: userData.licensePlate || "",
        currentLocation: userData.currentLocation || "En attente"
      });
      
      // Charger les statistiques du chauffeur
      loadDriverStats(currentUser.id);
      
    } catch (error) {
      console.error('Erreur:', error);
      
      // En cas d'erreur, utiliser les données locales
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setDriver({
          id: currentUser.id,
          fullName: currentUser.fullName || "Chauffeur",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || "",
          role: currentUser.role || "DRIVER",
          vehicleType: "Voiture",
          licensePlate: "AB-123-CD",
          statut: "ACTIF",
          currentLocation: "Centre-ville",
          rating: 4.8
        });
        
        setEditData({
          fullName: currentUser.fullName || "Chauffeur",
          phoneNumber: currentUser.phoneNumber || "",
          vehicleType: "Voiture",
          licensePlate: "AB-123-CD",
          currentLocation: "Centre-ville"
        });
      }
      
      // Charger des stats par défaut
      setStats({
        livraisonsJour: 15,
        livraisonsSemaine: 90,
        tauxLivraison: 97,
        distanceParcourue: "245 km",
        tempsMoyenLivraison: "22 min",
        evaluationsPositives: 98
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

  // Charger les statistiques du chauffeur
  const loadDriverStats = async (driverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/drivers/${driverId}/stats`, {
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
          livraisonsJour: 15,
          livraisonsSemaine: 90,
          tauxLivraison: 97,
          distanceParcourue: "245 km",
          tempsMoyenLivraison: "22 min",
          evaluationsPositives: 98
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
      case 'EN_LIVRAISON': return 'warning';
      case 'HORS_LIGNE': return 'default';
      case 'INACTIF': return 'error';
      default: return 'default';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (statut) => {
    switch(statut) {
      case 'ACTIF': return 'Disponible';
      case 'EN_LIVRAISON': return 'En livraison';
      case 'HORS_LIGNE': return 'Hors ligne';
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

    if (!editData.vehicleType.trim()) {
      setSnackbar({
        open: true,
        message: 'Le type de véhicule est requis',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${driver.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          phoneNumber: editData.phoneNumber,
          vehicleType: editData.vehicleType,
          licensePlate: editData.licensePlate,
          currentLocation: editData.currentLocation
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updatedDriver = await response.json();
      
      // Mettre à jour les données du profil
      setDriver({
        ...driver,
        fullName: updatedDriver.fullName,
        phoneNumber: updatedDriver.phoneNumber,
        vehicleType: updatedDriver.vehicleType || editData.vehicleType,
        licensePlate: updatedDriver.licensePlate || editData.licensePlate,
        currentLocation: updatedDriver.currentLocation || editData.currentLocation
      });
      
      // Mettre à jour dans le localStorage via authService
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUserData = {
          ...currentUser,
          fullName: updatedDriver.fullName,
          phoneNumber: updatedDriver.phoneNumber,
          vehicleType: updatedDriver.vehicleType,
          licensePlate: updatedDriver.licensePlate
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
      
      const response = await fetch(`http://localhost:8080/api/users/${driver.id}`, {
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
      fullName: driver.fullName,
      phoneNumber: driver.phoneNumber,
      vehicleType: driver.vehicleType,
      licensePlate: driver.licensePlate,
      currentLocation: driver.currentLocation
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
    if (!driver.fullName) return 'D';
    return driver.fullName.charAt(0).toUpperCase();
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
            🚗 Mon Profil Driver
          </Typography>
          <Typography color="text.secondary">
            Gérez vos informations et suivez vos performances de livraison
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Chip
            icon={<DirectionsCarIcon />}
            label="Chauffeur Livreur"
            color="info"
            size="medium"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label={getStatusLabel(driver.statut)}
            color={getStatusColor(driver.statut)}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Colonne gauche: Avatar et statistiques */}
        <Grid item xs={12} md={4}>
          {/* Carte Avatar et informations */}
         
       
        </Grid>
       
        {/* Colonne droite: Informations et sécurité */}
        <Grid item xs={12} md={8}>
          {/* Carte Informations personnelles */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Informations professionnelles
                </Typography>
                
                {!editMode ? (
                  <Button
                    variant="outlined"
                    color="info"
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
                      color="info"
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={editMode ? "info" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={driver.email}
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
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    value={editData.phoneNumber}
                    onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={editMode ? "info" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Type de véhicule"
                    value={editData.vehicleType}
                    onChange={(e) => setEditData({...editData, vehicleType: e.target.value})}
                    disabled={!editMode || saving}
                    select
                    SelectProps={{
                      native: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCarIcon color={editMode ? "info" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Voiture">Voiture</option>
                    <option value="Moto">Moto</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Vélo">Vélo</option>
                    <option value="Camionnette">Camionnette</option>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Plaque d'immatriculation"
                    value={editData.licensePlate}
                    onChange={(e) => setEditData({...editData, licensePlate: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color={editMode ? "info" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position actuelle"
                    value={editData.currentLocation}
                    onChange={(e) => setEditData({...editData, currentLocation: e.target.value})}
                    disabled={!editMode || saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color={editMode ? "info" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              {editMode && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Vos modifications seront sauvegardées et visibles par le service de livraison.
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
                    color="info"
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
                      color="info"
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
                            <LockIcon color="info" />
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
                            <LockIcon color="info" />
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
                            <LockIcon color="info" />
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
                    Pour des raisons de sécurité des livraisons, il est recommandé de changer votre mot de passe régulièrement.
                  </Typography>
                  
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Conseils de sécurité pour chauffeurs :
                    </Typography>
                    <Typography variant="body2">
                      • Utilisez un mot de passe fort et unique<br/>
                      • Ne partagez jamais vos identifiants<br/>
                      • Déconnectez-vous après chaque livraison<br/>
                      • Signalez toute activité suspecte au service de sécurité<br/>
                      • Verrouillez toujours votre véhicule
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

export default DriverProfil;