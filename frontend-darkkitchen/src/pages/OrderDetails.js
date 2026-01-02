// src/pages/OrderDetails.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  IconButton
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import OrderService from '../services/OrderService';
import AuthService from '../services/AuthService';

const OrderDetails = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchOrderDetails();
  }, [orderNumber, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Données mockées pour le développement
      const mockOrder = {
        id: 1,
        orderNumber: orderNumber || 'ORD-123456',
        orderDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 30 * 60000).toISOString(),
        totalAmount: 42.50,
        status: 'PREPARING',
        paymentStatus: 'PAID',
        paymentMethod: 'À la livraison',
        deliveryAddress: '123 Rue Example, 75001 Paris',
        specialInstructions: 'Sans oignons svp',
        items: [
          {
            id: 1,
            dish: {
              id: 1,
              name: 'Pizza Margherita',
              description: 'Tomate, mozzarella, basilic',
              price: 12.50,
              image: '/images/pizza.jpg'
            },
            quantity: 2,
            price: 12.50,
            specialRequest: ''
          },
          {
            id: 2,
            dish: {
              id: 2,
              name: 'Tiramisu',
              description: 'Dessert italien',
              price: 6.50,
              image: '/images/tiramisu.jpg'
            },
            quantity: 1,
            price: 6.50,
            specialRequest: ''
          }
        ],
        statusHistory: [
          { status: 'PENDING', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
          { status: 'CONFIRMED', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
          { status: 'PREPARING', timestamp: new Date(Date.now() - 10 * 60000).toISOString() }
        ]
      };
      
      setOrder(mockOrder);
      
      // Une fois l'API prête, utilisez:
      // const data = await OrderService.trackOrder(orderNumber);
      // setOrder(data);
      
    } catch (err) {
      setError('Erreur lors du chargement de la commande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const allSteps = [
      { label: 'En attente', value: 'PENDING' },
      { label: 'Confirmée', value: 'CONFIRMED' },
      { label: 'En préparation', value: 'PREPARING' },
      { label: 'Prête', value: 'READY' },
      { label: 'En livraison', value: 'ON_DELIVERY' },
      { label: 'Livrée', value: 'DELIVERED' }
    ];
    
    const currentIndex = allSteps.findIndex(step => step.value === order?.status);
    return { steps: allSteps, activeStep: currentIndex };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await OrderService.cancelOrder(order.id);
        fetchOrderDetails(); // Rafraîchir les données
      } catch (err) {
        setError('Erreur lors de l\'annulation');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Commande non trouvée'}
        </Alert>
        <Button component={Link} to="/my-orders" startIcon={<ArrowBackIcon />}>
          Retour à mes commandes
        </Button>
      </Container>
    );
  }

  const { steps, activeStep } = getStatusSteps();
  const canCancel = OrderService.canOrderBeCancelled(order);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Button
            component={Link}
            to="/my-orders"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1 }}
          >
            Mes commandes
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Commande #{order.orderNumber}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Passée le {formatDate(order.orderDate)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handlePrint} title="Imprimer">
            <PrintIcon />
          </IconButton>
          <IconButton title="Partager">
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Suivi de commande */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon />
              Suivi de commande
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
              {steps.map((step) => (
                <Step key={step.value}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`Livraison estimée: ${formatDate(order.deliveryDate)}`}
                color="primary"
                variant="outlined"
              />
              
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelOrder}
                >
                  Annuler la commande
                </Button>
              )}
            </Box>
          </Paper>

          {/* Détails des articles */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantIcon />
              Articles commandés
            </Typography>
            
            <List>
              {order.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        component="img"
                        src={item.dish.image || '/default-dish.jpg'}
                        alt={item.dish.name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mr: 2
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {item.dish.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.dish.description}
                        </Typography>
                        {item.specialRequest && (
                          <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                            Note: {item.specialRequest}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1">
                          {item.quantity} x {item.price.toFixed(2)}€
                        </Typography>
                        <Typography variant="h6" color="primary.main">
                          {(item.quantity * item.price).toFixed(2)}€
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < order.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total articles</Typography>
              <Typography variant="h6">
                {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Informations de livraison */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Livraison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Adresse:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {order.deliveryAddress}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Instructions:
            </Typography>
            <Typography variant="body1">
              {order.specialInstructions || 'Aucune instruction spéciale'}
            </Typography>
          </Paper>

          {/* Informations de paiement */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Paiement
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Méthode:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Statut:
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1">{order.paymentMethod}</Typography>
                <Chip
                  label={order.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                  color={order.paymentStatus === 'PAID' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Récapitulatif */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Sous-total:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Livraison:
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">
                  {(order.totalAmount - 2.50).toFixed(2)}€
                </Typography>
                <Typography variant="body2">2.50€</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary.main">
                {order.totalAmount.toFixed(2)}€
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;