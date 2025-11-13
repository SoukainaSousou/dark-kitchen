// src/pages/Auth.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 1 : 0;
  const [tabValue, setTabValue] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchParams({ tab: newValue === 1 ? 'register' : 'login' });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom fontWeight="bold">
          {tabValue === 0 ? 'Connexion' : 'Inscription'}
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>

        {tabValue === 0 ? (
          // Formulaire Connexion
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              Se connecter
            </Button>
          </Box>
        ) : (
          // Formulaire Inscription
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nom complet"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Téléphone"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              S'inscrire
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ou
          </Typography>
        </Divider>

        <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
          Continuer avec Google
        </Button>
        <Button variant="outlined" fullWidth>
          Continuer avec Facebook
        </Button>
      </Paper>
    </Container>
  );
};

export default Auth;