import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import { authService, utilsService } from '../services/api';

const steps = ['Commande reçue', 'En préparation', 'Prête', 'En livraison', 'Livrée'];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const loadOrder = async () => {
      const user = authService.getCurrentUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setLoading(true);
      
      try {
        // Simuler le chargement d'une commande
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer une commande fictive
        const mockOrder = await generateMockOrder(orderId, user.id);
        setOrder(mockOrder);
        
        // Déterminer l'étape active basée sur le statut
        const statusSteps = {
          'EN_ATTENTE': 0,
          'EN_PREPARATION': 1,
          'PRET': 2,
          'EN_LIVRAISON': 3,
          'LIVREE': 4
        };
        setActiveStep(statusSteps[mockOrder.status] || 0);
        
      } catch (err) {
        setError('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  const generateMockOrder = async (id, clientId) => {
    // Données fictives pour la démonstration
    const dishes = [
      { id: 1, name: 'Pizza Margherita', price: 12.50 },
      { id: 2, name: 'Pasta Carbonara', price: 14.00 },
      { id: 3, name: 'Salade César', price: 9.50 },
    ];

    const items = [
      { dishId: 1, dishName: dishes[0].name, quantity: 2, price: dishes[0].price, subtotal: dishes[0].price * 2 },
      { dishId: 2, dishName: dishes[1].name, quantity: 1, price: dishes[1].price, subtotal: dishes[1].price },
      { dishId: 3, dishName: dishes[2].name, quantity: 1, price: dishes[2].price, subtotal: dishes[2].price },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.10;
    const total = subtotal + deliveryFee + tax;

    return {
      id: parseInt(id),
      clientId,
      status: 'EN_LIVRAISON',
      statusLabel: 'En livraison',
      totalAmount: parseFloat(total.toFixed(2)),
      orderDate: new Date().toISOString(),
      deliveryAddress: '123 Rue de Paris, 75001 Paris',
      phoneNumber: '06 12 34 56 78',
      items,
      notes: 'Sonner 2 fois, porte à gauche',
      estimatedDelivery: '25-30 minutes',
      deliveryPerson: 'Jean Dupont',
      deliveryPhone: '06 98 76 54 32'
    };
  };

  const handleBack = () => {
    navigate('/orders');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVREE': return 'success';
      case 'ANNULEE': return 'error';
      case 'EN_LIVRAISON': return 'warning';
      case 'EN_PREPARATION': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des détails de la commande...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Retour aux commandes
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Commande non trouvée
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Retour aux commandes
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête avec bouton retour */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Retour aux commandes
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Commande #{order.id}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {utilsService.formatDate(order.orderDate)}
            </Typography>
          </Box>
          <Chip
            label={order.statusLabel}
            color={getStatusColor(order.status)}
            size="medium"
          />
        </Box>
        <Divider />
      </Box>

      {/* Suivi de commande */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Suivi de votre commande
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 4, mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={(activeStep / (steps.length - 1)) * 100} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {order.status === 'EN_LIVRAISON' && order.deliveryPerson && (
                <>
                  Livreur: <strong>{order.deliveryPerson}</strong> • Tél: {order.deliveryPhone}
                </>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Informations de livraison */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations de livraison
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HomeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Adresse:
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {order.deliveryAddress}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Téléphone:
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {order.phoneNumber}
                  </Typography>
                </Grid>
                
                {order.estimatedDelivery && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Temps estimé:
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      {order.estimatedDelivery}
                    </Typography>
                  </Grid>
                )}
                
                {order.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Notes:
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{order.notes}"
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Détails de la commande */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Détails de la commande
              </Typography>
              
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Article</TableCell>
                      <TableCell align="right">Qté</TableCell>
                      <TableCell align="right">Prix unit.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.dishName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{utilsService.formatPrice(item.price)}</TableCell>
                        <TableCell align="right">{utilsService.formatPrice(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography variant="body2">
                  Sous-total: {utilsService.formatPrice(order.totalAmount / 1.1 - 2.99)}
                </Typography>
                <Typography variant="body2">
                  Frais de livraison: {utilsService.formatPrice(2.99)}
                </Typography>
                <Typography variant="body2">
                  TVA (10%): {utilsService.formatPrice(order.totalAmount / 1.1 * 0.1)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Total: {utilsService.formatPrice(order.totalAmount)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => window.print()}
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': { backgroundColor: '#ad1457' }
          }}
        >
          Imprimer le reçu
        </Button>
        <Button
          variant="outlined"
          onClick={handleBack}
        >
          Retour aux commandes
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetails;