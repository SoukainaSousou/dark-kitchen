// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import AuthService from '../services/AuthService';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    registrationDate: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    loadProfile();
  }, [navigate]);

  const loadProfile = () => {
    const client = AuthService.getCurrentClient();
    if (client) {
      setProfile({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        email: client.email || '',
        phoneNumber: client.phoneNumber || '',
        address: client.address || '',
        city: client.city || '',
        postalCode: client.postalCode || '',
        registrationDate: client.registrationDate || new Date().toISOString()
      });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!profile.firstName || !profile.lastName || !profile.email) {
        throw new Error('Les champs obligatoires sont incomplets');
      }

      // Ici, appeler l'API pour mettre à jour le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Profil mis à jour avec succès');
      setEditMode(false);
      
      // Mettre à jour le localStorage
      const updatedClient = { ...AuthService.getCurrentClient(), ...profile };
      localStorage.setItem('client', JSON.stringify(updatedClient));

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Ici, appeler l'API pour changer le mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Mot de passe changé avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mon Profil
      </Typography>

      <Paper sx={{ overflow: 'hidden' }}>
        {/* En-tête du profil */}
        <Box sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white', 
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              fontSize: 32,
              bgcolor: 'white',
              color: 'primary.main'
            }}
          >
            {profile.firstName?.charAt(0) || profile.email?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body2">
              {profile.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Membre depuis {formatDate(profile.registrationDate)}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab icon={<PersonIcon />} label="Informations personnelles" />
            <Tab icon={<LocationOnIcon />} label="Adresses" />
            <Tab icon={<LockIcon />} label="Sécurité" />
            <Tab icon={<HistoryIcon />} label="Historique" />
          </Tabs>
        </Box>

        {/* Contenu des tabs */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Informations personnelles
                </Typography>
                {!editMode ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Modifier
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setEditMode(false);
                        loadProfile();
                        setError('');
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Déconnexion
              </Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Adresse de livraison
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ville"
                    name="city"
                    value={profile.city}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Code postal"
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleProfileChange}
                  />
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{ mt: 3 }}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer l\'adresse'}
              </Button>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Changer le mot de passe
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                    helperText="Minimum 6 caractères"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le nouveau mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={saving}
                  />
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving}
                sx={{ mt: 3 }}
              >
                {saving ? 'Changement en cours...' : 'Changer le mot de passe'}
              </Button>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Historique des commandes
              </Typography>
              
              <Alert severity="info">
                <Typography>
                  Consultez votre historique complet de commandes dans la section "Mes Commandes".
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/my-orders')}
                  sx={{ mt: 1 }}
                >
                  Voir mes commandes
                </Button>
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;