// src/pages/Delivery.js
import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Delivery = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Livraison & Retrait
      </Typography>

      <Grid container spacing={4}>
        {/* Zone de Livraison */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationOnIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Zone de Livraison
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nous livrons dans un rayon de 5km
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Chip label="Paris Centre" sx={{ mr: 1, mb: 1 }} />
              <Chip label="11ème arrondissement" sx={{ mr: 1, mb: 1 }} />
              <Chip label="12ème arrondissement" sx={{ mr: 1, mb: 1 }} />
              <Chip label="20ème arrondissement" sx={{ mr: 1, mb: 1 }} />
            </Box>
            
            <Button variant="contained" fullWidth>
              Vérifier mon adresse
            </Button>
          </Card>
        </Grid>

        {/* Horaires */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ScheduleIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Horaires de Livraison
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Commandez quand vous voulez
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Lundi - Dimanche</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                11h00 - 23h00
              </Typography>
            </Box>
            
            <Chip 
              label="Livraison en 25min en moyenne" 
              color="success" 
              variant="outlined"
            />
          </Card>
        </Grid>

        {/* Frais de Livraison */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalShippingIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Frais de Livraison
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Commandes +20€</strong> : Livraison gratuite
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Commandes -20€</strong> : 2.90€ de frais
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Paiement */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PaymentIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Moyens de Paiement
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Carte Bancaire" />
              <Chip label="PayPal" />
              <Chip label="Apple Pay" />
              <Chip label="Google Pay" />
              <Chip label="Espèces" />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Delivery;