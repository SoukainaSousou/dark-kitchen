import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { orderService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Icons
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ChefOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger les commandes pour le cuisinier
  const loadChefOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getCurrentUser();
      if (!user) {
        setError('Veuillez vous connecter');
        navigate('/login');
        return;
      }
      
      // Vérifier si c'est un cuisinier ou admin
      const isChef = user.role && ['CHEF', 'chef', 'ADMIN', 'admin'].includes(user.role);
      if (!isChef) {
        setError('Accès réservé aux cuisiniers');
        navigate('/');
        return;
      }
      
      setCurrentUser(user);
      
      // Charger les commandes en préparation ET prêtes (pour voir l'historique)
      const pendingOrders = await orderService.getPendingOrdersForChef();
      
      // On garde toutes les commandes (EN_PREPARATION et PRET)
      // Pour l'historique, on pourrait aussi charger les PRET
      setOrders(pendingOrders);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  // Marquer comme prêt
  const markAsReady = async (orderId) => {
    try {
      setProcessing(true);
      
      // Changer le statut à PRET
      await orderService.updateOrderStatus(orderId, 'PRET', 'cuisinier');
      
      // Mettre à jour localement - changer juste le statut de la commande
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: 'PRET', completedAt: new Date() }
            : order
        )
      );
      
      setSuccessMessage(`Commande #${orderId} marquée comme prête !`);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setProcessing(false);
    }
  };

  // Estimation du temps de préparation
  const getPreparationTime = (items) => {
    if (!items || !items.length) return '15-20 min';
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems <= 2) return '10-15 min';
    if (totalItems <= 4) return '15-25 min';
    return '25-35 min';
  };

  // Rafraîchir automatiquement
  useEffect(() => {
    loadChefOrders();
    
    // Rafraîchir toutes les 30 secondes pour nouvelles commandes
    const interval = setInterval(loadChefOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compter les commandes par statut
  const pendingCount = orders.filter(order => order.status === 'EN_PREPARATION').length;
  const readyCount = orders.filter(order => order.status === 'PRET').length;

  if (loading && orders.length === 0) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement des commandes...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && !currentUser) {
    return (
      <Container>
        <Box p={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Notifications */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          <KitchenIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Zone Cuisine
        </Typography>
        <Typography color="text.secondary">
          {pendingCount} à préparer • {readyCount} prêtes
        </Typography>
      </Box>

      {/* Bouton rafraîchir */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {pendingCount > 0 && (
            <Chip 
              label={`${pendingCount} à préparer`}
              color="warning"
              size="small"
              icon={<AccessTimeIcon />}
            />
          )}
          {readyCount > 0 && (
            <Chip 
              label={`${readyCount} prêtes`}
              color="success"
              size="small"
              icon={<DoneIcon />}
            />
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadChefOrders}
          disabled={loading}
          size="small"
        >
          Actualiser
        </Button>
      </Box>

      {/* Commandes */}
      {orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune commande en préparation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Les nouvelles commandes apparaîtront ici automatiquement
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => {
            const isReady = order.status === 'PRET';
            
            return (
              <Grid item xs={12} md={6} lg={4} key={order.orderId}>
                <Card sx={{ 
                  height: '100%', 
                  position: 'relative',
                  borderLeft: '4px solid',
                  borderColor: isReady ? 'success.main' : 'primary.main',
                  opacity: isReady ? 0.85 : 1,
                  '&:hover': {
                    boxShadow: isReady ? 2 : 4,
                    transform: isReady ? 'none' : 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}>
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color={isReady ? 'success.main' : 'primary.main'}>
                          Commande #{order.orderId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.orderDate && new Date(order.orderDate).toLocaleTimeString('fr-FR')}
                        </Typography>
                        {order.completedAt && (
                          <Typography variant="caption" color="success.main" display="block">
                            Prête à {new Date(order.completedAt).toLocaleTimeString('fr-FR')}
                          </Typography>
                        )}
                      </Box>
                      {!isReady && (
                        <Chip
                          icon={<TimerIcon />}
                          label={getPreparationTime(order.items)}
                          color="warning"
                          size="small"
                        />
                      )}
                      {isReady && (
                        <Chip
                          icon={<DoneIcon />}
                          label="Prête"
                          color="success"
                          size="small"
                        />
                      )}
                    </Box>

                    {/* Client */}
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        {order.clientFullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                        {order.phoneNumber}
                      </Typography>
                    </Box>
                    
                    {/* Articles */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />
                        Articles ({order.items?.length || 0})
                      </Typography>
                      {order.items?.slice(0, 2).map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          py: 0.5
                        }}>
                          <Typography variant="body2">
                            {item.quantity} × {item.dishName}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {(item.quantity * (item.price || 0)).toFixed(2)}€
                          </Typography>
                        </Box>
                      ))}
                      {order.items?.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          + {order.items.length - 2} autre(s) article(s)
                        </Typography>
                      )}
                      <Typography variant="body2" fontWeight="bold" sx={{ mt: 1, pt: 1, borderTop: '1px dashed #e0e0e0' }}>
                        Total: {parseFloat(order.totalAmount || 0).toFixed(2)}€
                      </Typography>
                    </Box>

                    {/* Notes */}
                    {order.notes && (
                      <Alert 
                        severity="info" 
                        sx={{ mb: 2 }}
                        icon={<LocalPizzaIcon />}
                      >
                        <Typography variant="caption">
                          {order.notes}
                        </Typography>
                      </Alert>
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!isReady ? (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={() => markAsReady(order.orderId)}
                          disabled={processing}
                          startIcon={<CheckCircleIcon />}
                          size="small"
                        >
                          Marquer prêt
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          disabled
                          startIcon={<DoneIcon />}
                          size="small"
                          sx={{ 
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            '&:disabled': {
                              bgcolor: 'success.light',
                              color: 'success.dark'
                            }
                          }}
                        >
                          Déjà prête
                        </Button>
                      )}
                      
                      <Tooltip title="Voir détails">
                        <IconButton
                          onClick={() => setSelectedOrder(order)}
                          color={isReady ? 'success' : 'primary'}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog Détails */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                Commande #{selectedOrder.orderId}
              </Typography>
              <Chip
                label={selectedOrder.status === 'PRET' ? 'Prête' : 'En préparation'}
                color={selectedOrder.status === 'PRET' ? 'success' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
            </DialogTitle>
            
            <DialogContent dividers>
              {/* Informations client */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Informations client
                </Typography>
                <Typography variant="body2">{selectedOrder.clientFullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.phoneNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  {selectedOrder.deliveryAddress}
                </Typography>
              </Box>

              {/* Articles */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Articles commandés
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {selectedOrder.items?.map((item, index) => (
                  <Paper key={index} sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.dishName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantité: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {(item.quantity * (item.price || 0)).toFixed(2)}€
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="h6" align="right" color="primary">
                  Total: {parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}€
                </Typography>
              </Box>

              {selectedOrder.notes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>
                Fermer
              </Button>
              {selectedOrder.status !== 'PRET' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    markAsReady(selectedOrder.orderId);
                    setSelectedOrder(null);
                  }}
                  disabled={processing}
                  startIcon={<CheckCircleIcon />}
                >
                  Marquer comme prêt
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ChefOrders;