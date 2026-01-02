// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyIcon from '@mui/icons-material/Money';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AuthService from '../services/AuthService';
import OrderService from '../services/OrderService';

const steps = ['Adresse', 'Paiement', 'Confirmation'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    floor: '',
    intercom: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
    }
    
    // Charger l'adresse du client si disponible
    const client = AuthService.getCurrentClient();
    if (client?.address) {
      setAddress(prev => ({
        ...prev,
        street: client.address || '',
        city: client.city || '',
        postalCode: client.postalCode || ''
      }));
    }
  }, [navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validation de l'adresse
      if (!address.street || !address.city || !address.postalCode) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      setError('');
    }
    
    if (activeStep === 1) {
      handlePlaceOrder();
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/cart');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        deliveryAddress: `${address.street}, ${address.postalCode} ${address.city}`,
        specialInstructions: specialInstructions,
        paymentMethod: paymentMethod,
        floor: address.floor,
        intercom: address.intercom
      };

      // Ici, vous devriez appeler OrderService.createOrderFromCart()
      // Pour l'instant, simulation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockOrder = {
        id: Math.floor(Math.random() * 10000),
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: 42.50,
        estimatedDelivery: '25-30 minutes'
      };

      setSuccess(`Commande #${mockOrder.orderNumber} créée avec succès !`);
      setActiveStep(2);
      
      // Redirection après quelques secondes
      setTimeout(() => {
        navigate(`/order/${mockOrder.orderNumber}`);
      }, 5000);

    } catch (err) {
      setError('Erreur lors de la création de la commande: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Adresse de livraison
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse *"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Code postal *"
                  value={address.postalCode}
                  onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ville *"
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Étage"
                  value={address.floor}
                  onChange={(e) => setAddress({...address, floor: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Interphone"
                  value={address.intercom}
                  onChange={(e) => setAddress({...address, intercom: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions spéciales"
                  multiline
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Allergies, préférences, code d'entrée..."
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Méthode de paiement
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon />
                    <Box>
                      <Typography>Paiement à la livraison</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Espèces ou carte bancaire
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon />
                    <Box>
                      <Typography>Paiement en ligne</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carte bancaire sécurisée
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Total à payer:</strong> 42.50€
                <br />
                <strong>Livraison estimée:</strong> 25-30 minutes
              </Typography>
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Commande confirmée !
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Votre commande a été passée avec succès.
            </Typography>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              Redirection vers le suivi de commande...
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Validation de commande
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={loading}
          >
            {activeStep === 0 ? 'Retour au panier' : 'Retour'}
          </Button>
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'Traitement...' : activeStep === 1 ? 'Confirmer la commande' : 'Continuer'}
            </Button>
          )}
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Récapitulatif de la commande
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Sous-total:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Livraison:
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body2">35.00€</Typography>
            <Typography variant="body2">2.50€</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary.main">37.50€</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;