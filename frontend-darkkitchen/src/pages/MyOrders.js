// src/pages/MyOrders.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import OrderService from '../services/OrderService';
import HistoryIcon from '@mui/icons-material/History';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Constantes
const DELIVERY_FEE = 30; // Frais de livraison en DH
const CURRENCY = 'DH';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, orderId: null, orderNumber: '' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, orderId: null, orderNumber: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (AuthService.isClient()) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Vérifier l'authentification
      if (!AuthService.isAuthenticated()) {
        throw new Error('Veuillez vous connecter pour voir vos commandes');
      }
      
      // Récupérer les commandes depuis l'API
      const data = await OrderService.getMyOrders();
      
      // Formater les données avec calculs
      const formattedOrders = data.map(order => {
        // Calculer le sous-total
        const subtotal = calculateSubtotalFromData(order);
        const total = subtotal + DELIVERY_FEE;
        
        return {
          id: order.id,
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          orderDate: order.orderDate || order.createdAt,
          subtotal: subtotal,
          totalAmount: total,
          status: order.status || 'PENDING',
          paymentStatus: order.paymentStatus || 'PENDING',
          deliveryAddress: order.deliveryAddress || order.address || '',
          items: order.items || order.orderItems || [],
          client: order.client || null
        };
      });
      
      setOrders(formattedOrders);
      
    } catch (err) {
      console.error('Erreur fetchOrders:', err);
      
      if (err.message.includes('Non authentifié') || err.message.includes('401')) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 3000);
      } else if (err.message.includes('404') || err.message.includes('endpoint')) {
        setError('L\'API de commandes n\'est pas encore disponible. Utilisation de données de démonstration.');
        setOrders(generateMockOrders());
      } else {
        setError('Erreur lors du chargement des commandes: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer le sous-total à partir des données de l'API
  const calculateSubtotalFromData = (order) => {
    if (!order.items && !order.orderItems) return 0;
    
    const items = order.items || order.orderItems || [];
    return items.reduce((total, item) => {
      const price = parseFloat(item.dish?.price || item.price || item.dishPrice || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + (price * quantity);
    }, 0);
  };

  const generateMockOrders = () => {
    return [
      {
        id: 1,
        orderNumber: 'ORD-' + Date.now().toString().slice(-6),
        orderDate: new Date().toISOString(),
        subtotal: 65,
        totalAmount: 95,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        deliveryAddress: '123 Rue Example, 75001 Paris',
        items: [
          { 
            dish: { 
              name: 'Pizza Margherita', 
              price: 25
            }, 
            quantity: 2 
          },
          { 
            dish: { 
              name: 'Coca-Cola', 
              price: 15
            }, 
            quantity: 1 
          }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-' + (Date.now() - 86400000).toString().slice(-6),
        orderDate: new Date(Date.now() - 86400000).toISOString(),
        subtotal: 45,
        totalAmount: 75,
        status: 'PREPARING',
        paymentStatus: 'PAID',
        deliveryAddress: '456 Avenue Test, 69002 Lyon',
        items: [
          { 
            dish: { 
              name: 'Burger Deluxe', 
              price: 15
            }, 
            quantity: 3 
          }
        ]
      }
    ];
  };

  const handleCancelOrder = async () => {
    try {
      const result = await OrderService.cancelOrder(cancelDialog.orderId);
      
      setSnackbar({
        open: true,
        message: result.message || `Commande #${cancelDialog.orderNumber} annulée avec succès`,
        severity: 'success'
      });
      
      fetchOrders();
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erreur lors de l\'annulation',
        severity: 'error'
      });
    } finally {
      setCancelDialog({ open: false, orderId: null, orderNumber: '' });
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const result = await OrderService.confirmOrder(confirmDialog.orderId);
      
      setSnackbar({
        open: true,
        message: result.message || `Commande #${confirmDialog.orderNumber} confirmée`,
        severity: 'success'
      });
      
      fetchOrders();
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erreur lors de la confirmation',
        severity: 'error'
      });
    } finally {
      setConfirmDialog({ open: false, orderId: null, orderNumber: '' });
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { 
          text: 'En attente', 
          color: 'warning', 
          icon: <AccessTimeIcon />,
          canCancel: true,
          canConfirm: true,
          description: 'Commande reçue, en attente de confirmation'
        };
      case 'CONFIRMED':
        return { 
          text: 'Confirmée', 
          color: 'info', 
          icon: <CheckCircleIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Commande confirmée, en attente de préparation'
        };
      case 'PREPARING':
        return { 
          text: 'En préparation', 
          color: 'info', 
          icon: <RestaurantIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Votre commande est en cours de préparation'
        };
      case 'READY':
        return { 
          text: 'Prête', 
          color: 'success', 
          icon: <CheckCircleIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Commande prête pour la livraison'
        };
      case 'ON_DELIVERY':
        return { 
          text: 'En livraison', 
          color: 'primary', 
          icon: <LocalShippingIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Votre commande est en route'
        };
      case 'DELIVERED':
        return { 
          text: 'Livrée', 
          color: 'success', 
          icon: <CheckCircleIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Commande livrée avec succès'
        };
      case 'CANCELLED':
        return { 
          text: 'Annulée', 
          color: 'error', 
          icon: <CancelIcon />,
          canCancel: false,
          canConfirm: false,
          description: 'Commande annulée'
        };
      default:
        return { 
          text: status, 
          color: 'default', 
          icon: null,
          canCancel: false,
          canConfirm: false,
          description: ''
        };
    }
  };

  const getPaymentStatusInfo = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return { text: 'Payée', color: 'success' };
      case 'PENDING':
        return { text: 'En attente', color: 'warning' };
      case 'FAILED':
        return { text: 'Échouée', color: 'error' };
      case 'REFUNDED':
        return { text: 'Remboursée', color: 'info' };
      default:
        return { text: paymentStatus, color: 'default' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalItems = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const calculateItemSubtotal = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      const price = parseFloat(item.dish?.price || item.price || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + (price * quantity);
    }, 0);
  };

  const handleDownloadInvoice = (order) => {
    const subtotal = calculateItemSubtotal(order);
    const total = subtotal + DELIVERY_FEE;
    
    const invoiceContent = `
====================================
          FACTURE - RESTAURANT
====================================
Commande: #${order.orderNumber}
Date: ${formatDate(order.orderDate)}

Client: ${order.client?.firstName || ''} ${order.client?.lastName || ''}
Adresse: ${order.deliveryAddress || ''}

====================================
DÉTAILS DE LA COMMANDE
====================================
${order.items?.map((item, index) => {
  const price = parseFloat(item.dish?.price || item.price || 0);
  const quantity = parseInt(item.quantity || 1);
  const itemTotal = price * quantity;
  return `${item.dish?.name || 'Article'} x${quantity} @ ${price.toFixed(2)} ${CURRENCY} = ${itemTotal.toFixed(2)} ${CURRENCY}`;
}).join('\n')}

====================================
RÉCAPITULATIF
====================================
Sous-total: ${subtotal.toFixed(2)} ${CURRENCY}
Frais de livraison: ${DELIVERY_FEE.toFixed(2)} ${CURRENCY}
------------------------------------
TOTAL: ${total.toFixed(2)} ${CURRENCY}

====================================
Statut: ${getStatusInfo(order.status).text}
Paiement: ${getPaymentStatusInfo(order.paymentStatus).text}

Merci pour votre commande !
====================================
`;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setSnackbar({
      open: true,
      message: `Facture #${order.orderNumber} téléchargée`,
      severity: 'success'
    });
  };

  const renderOrderDetails = (order) => {
    const statusInfo = getStatusInfo(order.status);
    const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
    const subtotal = calculateItemSubtotal(order);
    const total = subtotal + DELIVERY_FEE;
    
    return (
      <Grid item xs={12} key={order.id}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Commande #{order.orderNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passée le {formatDate(order.orderDate)}
                </Typography>
                {order.deliveryAddress && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Livraison:</strong> {order.deliveryAddress}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.text}
                  color={statusInfo.color}
                  sx={{ mb: 1 }}
                />
                <Chip
                  label={paymentInfo.text}
                  color={paymentInfo.color}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" color="primary.main">
                  {total.toFixed(2)} {CURRENCY}
                </Typography>
              </Box>
            </Box>

            {statusInfo.description && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {statusInfo.description}
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Tableau des articles */}
            <Typography variant="subtitle2" gutterBottom>
              Articles ({calculateTotalItems(order)} articles)
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Article</TableCell>
                    <TableCell align="center">Quantité</TableCell>
                    <TableCell align="right">Prix unitaire ({CURRENCY})</TableCell>
                    <TableCell align="right">Total ({CURRENCY})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, index) => {
                    const price = parseFloat(item.dish?.price || item.price || 0);
                    const quantity = parseInt(item.quantity || 1);
                    const itemTotal = price * quantity;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {item.dish?.name || 'Article'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{quantity}</TableCell>
                        <TableCell align="right">{price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <strong>{itemTotal.toFixed(2)}</strong>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" fontWeight="bold">
                        Sous-total:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {subtotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2">
                        Frais de livraison:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {DELIVERY_FEE.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">
                        Total:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary.main">
                        {total.toFixed(2)} {CURRENCY}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to={`/order/${order.orderNumber}`}
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                >
                  Voir détails
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReceiptIcon />}
                  onClick={() => handleDownloadInvoice(order)}
                >
                  Télécharger facture
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {statusInfo.canConfirm && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setConfirmDialog({ 
                      open: true, 
                      orderId: order.id, 
                      orderNumber: order.orderNumber 
                    })}
                  >
                    Confirmer la commande
                  </Button>
                )}
                {statusInfo.canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setCancelDialog({ 
                      open: true, 
                      orderId: order.id, 
                      orderNumber: order.orderNumber 
                    })}
                    startIcon={<CancelIcon />}
                  >
                    Annuler
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (!AuthService.isClient()) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            Accès réservé aux clients
          </Typography>
          <Typography>
            Cette page est uniquement accessible aux clients connectés.
          </Typography>
          <Button 
            component={Link} 
            to="/auth" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          <HistoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Mes Commandes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consultez et gérez toutes vos commandes passées
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={fetchOrders}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Actualiser
          </Button>
          <Button 
            component={Link} 
            to="/menu" 
            variant="contained"
          >
            Commander maintenant
          </Button>
          <Typography variant="body2" color="text.secondary">
            <strong>Frais de livraison:</strong> {DELIVERY_FEE} {CURRENCY}
          </Typography>
        </Box>
      </Box>

      {error && !orders.length ? (
        <Alert 
          severity={error.includes('démonstration') ? 'info' : 'error'} 
          sx={{ mb: 4 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchOrders}
              disabled={loading}
            >
              Réessayer
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucune commande
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Vous n'avez pas encore passé de commande.
          </Typography>
          <Button component={Link} to="/menu" variant="contained" size="large">
            Découvrir le menu
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => renderOrderDetails(order))}
        </Grid>
      )}

      {/* Dialogs et Snackbar inchangés */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, orderId: null, orderNumber: '' })}>
        <DialogTitle>Annuler la commande #{cancelDialog.orderNumber}</DialogTitle>
        <DialogContent>
          <Typography paragraph>Êtes-vous sûr de vouloir annuler cette commande ?</Typography>
          <Alert severity="warning">Cette action est irréversible.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, orderId: null, orderNumber: '' })}>
            Non
          </Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Oui, annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, orderId: null, orderNumber: '' })}>
        <DialogTitle>Confirmer la commande #{confirmDialog.orderNumber}</DialogTitle>
        <DialogContent>
          <Typography paragraph>Confirmez-vous cette commande ? Elle passera en préparation.</Typography>
          <Alert severity="info">Une fois confirmée, la commande ne pourra plus être annulée.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, orderId: null, orderNumber: '' })}>
            Annuler
          </Button>
          <Button onClick={handleConfirmOrder} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyOrders;