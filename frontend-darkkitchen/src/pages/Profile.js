import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Tabs,
  Tab,
  Paper,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HistoryIcon from '@mui/icons-material/History';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningIcon from '@mui/icons-material/Warning';
import { authService } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Dialog pour suppression de compte
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les données de l'utilisateur depuis le backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          navigate('/cart');
          return;
        }
        
        // Récupérer les données fraîches depuis le backend
        const userData = await authService.getClientProfile(currentUser.id);
        
        setUser(userData);
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || ''
        });
        
        setError('');
      } catch (err) {
        console.error('Erreur chargement profil:', err);
        // Si erreur API, utiliser les données locales
        const localUser = authService.getCurrentUser();
        if (localUser) {
          setUser(localUser);
          setProfileData({
            firstName: localUser.firstName || '',
            lastName: localUser.lastName || '',
            email: localUser.email || '',
            phoneNumber: localUser.phoneNumber || '',
            address: localUser.address || '',
            city: localUser.city || '',
            postalCode: localUser.postalCode || ''
          });
        }
        setError('Impossible de charger les données du serveur');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // Fonctions utilitaires
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9+\s]{10,}$/.test(phone.replace(/\s/g, ''));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Non disponible';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!profileData.firstName.trim()) {
      setError('Le prénom est requis');
      return;
    }

    if (!profileData.lastName.trim()) {
      setError('Le nom est requis');
      return;
    }

    if (!profileData.email.trim()) {
      setError('L\'email est requis');
      return;
    }

    if (!isValidEmail(profileData.email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    if (profileData.phoneNumber && !isValidPhone(profileData.phoneNumber)) {
      setError('Veuillez entrer un numéro de téléphone valide (ex: 06 12 34 56 78)');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données pour l'API
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        city: profileData.city || '',
        postalCode: profileData.postalCode || ''
      };

      // Appeler l'API backend
      const result = await authService.updateProfile(user.id, updateData);
      
      // Mettre à jour l'état local
      setUser(result.client);
      setEditMode(false);
      setSuccess('Profil mis à jour avec succès !');
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      setError('Le mot de passe actuel est requis');
      return;
    }

    if (!passwordData.newPassword) {
      setError('Le nouveau mot de passe est requis');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Appeler l'API backend
      const result = await authService.changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordEditMode(false);
      setSuccess(result.message || 'Mot de passe modifié avec succès !');
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || ''
    });
    setEditMode(false);
    setError('');
  };

  const handleCancelPasswordEdit = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordEditMode(false);
    setError('');
  };

  const handleViewOrders = () => {
    navigate('/mes-commandes');
  };

  const getUserInitial = () => {
    if (!user || !user.firstName) return 'U';
    return user.firstName.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement de votre profil...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Accès non autorisé
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Veuillez vous connecter pour accéder à votre profil
          </Typography>
          <Button 
            variant="contained"
            onClick={() => navigate('/cart')}
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            Retour au panier
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#e91e63',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {getUserInitial()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              {user.phoneNumber && (
                <Typography variant="body2" color="text.secondary">
                  {user.phoneNumber}
                </Typography>
              )}
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={handleViewOrders}
            sx={{ 
              borderColor: '#e91e63',
              color: '#e91e63',
              '&:hover': {
                borderColor: '#ad1457',
                backgroundColor: 'rgba(233, 30, 99, 0.04)'
              }
            }}
          >
            Mes Commandes
          </Button>
        </Box>
        <Divider />
      </Box>

      {/* Messages */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* Onglets */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ 
            '& .MuiTab-root': {
              fontWeight: tabValue === 0 ? 'bold' : 'normal',
              color: tabValue === 0 ? '#e91e63' : 'inherit'
            },
            '& .Mui-selected': {
              color: '#e91e63 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#e91e63'
            }
          }}
        >
          <Tab label="Informations personnelles" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Sécurité" icon={<LockIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      {tabValue === 0 ? (
        // Onglet Informations personnelles
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Informations personnelles
              </Typography>
              {!editMode ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  sx={{ 
                    borderColor: '#e91e63',
                    color: '#e91e63',
                    '&:hover': {
                      borderColor: '#ad1457',
                      backgroundColor: 'rgba(233, 30, 99, 0.04)'
                    }
                  }}
                >
                  Modifier
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                    startIcon={saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    sx={{ 
                      backgroundColor: '#e91e63',
                      '&:hover': { backgroundColor: '#ad1457' },
                      minWidth: '120px'
                    }}
                  >
                    {saving ? '' : 'Enregistrer'}
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={editMode ? "primary" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={editMode ? "primary" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={true} // Email non modifiable
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  placeholder="06 12 34 56 78"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color={editMode ? "primary" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color={editMode ? "primary" : "action"} sx={{ alignSelf: 'flex-start', mt: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ville"
                  name="city"
                  value={profileData.city}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Code postal"
                  name="postalCode"
                  value={profileData.postalCode}
                  onChange={handleProfileChange}
                  disabled={!editMode || saving}
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Informations complémentaires */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
              Informations de compte
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Date d'inscription:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(user.registrationDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Statut du compte:
                </Typography>
                <Typography variant="body1" fontWeight="medium" color={user.active ? "success.main" : "error.main"}>
                  {user.active !== false ? 'Actif ✓' : 'Inactif ✗'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        // Onglet Sécurité
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Sécurité du compte
              </Typography>
              {!passwordEditMode ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setPasswordEditMode(true)}
                  sx={{ 
                    borderColor: '#e91e63',
                    color: '#e91e63',
                    '&:hover': {
                      borderColor: '#ad1457',
                      backgroundColor: 'rgba(233, 30, 99, 0.04)'
                    }
                  }}
                >
                  Changer le mot de passe
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                    startIcon={saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                    onClick={handleChangePassword}
                    disabled={saving}
                    sx={{ 
                      backgroundColor: '#e91e63',
                      '&:hover': { backgroundColor: '#ad1457' },
                      minWidth: '120px'
                    }}
                  >
                    {saving ? '' : 'Modifier'}
                  </Button>
                </Box>
              )}
            </Box>

            {passwordEditMode ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pour changer votre mot de passe, veuillez remplir les champs ci-dessous :
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel *"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nouveau mot de passe *"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                    helperText="Minimum 6 caractères"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            size="small"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le nouveau mot de passe *"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="body1" paragraph color="text.secondary">
                  Pour des raisons de sécurité, il est recommandé de changer votre mot de passe régulièrement.
                </Typography>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
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

            <Divider sx={{ my: 3 }} />
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={handleViewOrders}
              sx={{ 
                borderColor: '#e91e63',
                color: '#e91e63',
                '&:hover': {
                  borderColor: '#ad1457',
                  backgroundColor: 'rgba(233, 30, 99, 0.04)'
                }
              }}
            >
              Mes Commandes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RestaurantIcon />}
              onClick={() => navigate('/menu')}
              sx={{ 
                borderColor: '#e91e63',
                color: '#e91e63',
                '&:hover': {
                  borderColor: '#ad1457',
                  backgroundColor: 'rgba(233, 30, 99, 0.04)'
                }
              }}
            >
              Commander
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setTabValue(1)}
              sx={{ 
                borderColor: '#e91e63',
                color: '#e91e63',
                '&:hover': {
                  borderColor: '#ad1457',
                  backgroundColor: 'rgba(233, 30, 99, 0.04)'
                }
              }}
            >
              Sécurité
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<PersonIcon />}
              onClick={() => {
                authService.logout();
                navigate('/');
              }}
              sx={{ 
                backgroundColor: '#f44336',
                '&:hover': { backgroundColor: '#d32f2f' }
              }}
            >
              Déconnexion
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;