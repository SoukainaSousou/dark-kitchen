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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { orderService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsIcon from '@mui/icons-material/Directions';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const DeliveryOrders = () => {
  const navigate = useNavigate();
  const [readyOrders, setReadyOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deliveryCode, setDeliveryCode] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Charger les commandes pour le livreur
  const loadDeliveryOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getCurrentUser();
      if (!user) {
        setError('Veuillez vous connecter');
        navigate('/login');
        return;
      }
      
      // Vérifier si c'est un livreur ou admin
      const isDriver = user.role && ['DRIVER', 'driver', 'ADMIN', 'admin'].includes(user.role);
      if (!isDriver) {
        setError('Accès réservé aux livreurs');
        navigate('/');
        return;
      }
      
      setCurrentUser(user);
      
      // Charger les commandes prêtes
      const ordersData = await orderService.getReadyOrdersForDelivery();
      
      // Séparer les commandes prêtes et en livraison
      const ready = ordersData.filter(order => order.status === 'PRET');
      const active = ordersData.filter(order => order.status === 'EN_LIVRAISON');
      
      setReadyOrders(ready);
      setActiveDeliveries(active);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  // Prendre une commande en livraison
  const startDelivery = async (orderId) => {
    try {
      setProcessing(true);
      
      // Générer un code de livraison simple
      const code = Math.floor(1000 + Math.random() * 9000);
      setDeliveryCode(code.toString());
      
      // Changer le statut à EN_LIVRAISON
      await orderService.updateOrderStatus(orderId, 'EN_LIVRAISON', 'livreur');
      
      setSuccessMessage(`Commande #${orderId} prise en charge! Code: ${code}`);
      
      // Recharger les commandes
      await loadDeliveryOrders();
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la prise en charge');
    } finally {
      setProcessing(false);
    }
  };

  // Marquer comme livrée
  const markAsDelivered = async (orderId) => {
    try {
      setProcessing(true);
      
      // Changer le statut à LIVREE
      await orderService.updateOrderStatus(orderId, 'LIVREE', 'livreur');
      
      setSuccessMessage(`Commande #${orderId} marquée comme livrée!`);
      setConfirmDialog(null);
      
      // Recharger les commandes
      await loadDeliveryOrders();
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la livraison');
    } finally {
      setProcessing(false);
    }
  };

  // Calculer la distance estimée (simulée)
  const getEstimatedDistance = () => {
    const distances = ['1.2 km', '2.5 km', '3.1 km', '1.8 km', '4.2 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Temps estimé de livraison
  const getEstimatedTime = () => {
    const times = ['15-20 min', '20-25 min', '25-30 min', '30-35 min'];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Rafraîchir automatiquement
  useEffect(() => {
    loadDeliveryOrders();
    
    // Rafraîchir toutes les 20 secondes
    const interval = setInterval(loadDeliveryOrders, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading && readyOrders.length === 0 && activeDeliveries.length === 0) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement...</Typography>
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
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(null)}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          <TwoWheelerIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Zone Livraison
        </Typography>
        <Typography color="text.secondary">
          Prêtes: {readyOrders.length} • En cours: {activeDeliveries.length}
        </Typography>
      </Box>

      {/* Livraisons en cours */}
      {activeDeliveries.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Livraisons en cours
          </Typography>
          <Grid container spacing={2}>
            {activeDeliveries.map((order) => (
              <Grid item xs={12} md={6} key={order.orderId}>
                <Card sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Commande #{order.orderId}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          En route vers {order.clientFullName}
                        </Typography>
                      </Box>
                      <Chip
                        label="EN LIVRAISON"
                        color="secondary"
                        sx={{ color: 'white' }}
                      />
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 1 }} />
                        <Typography>{getEstimatedTime()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsIcon sx={{ mr: 1 }} />
                        <Typography>{getEstimatedDistance()}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => setConfirmDialog(order)}
                        startIcon={<DoneAllIcon />}
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                      >
                        Marquer livrée
                      </Button>
                      <Tooltip title="Voir détails">
                        <IconButton
                          sx={{ color: 'white' }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Commandes prêtes */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Commandes prêtes ({readyOrders.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadDeliveryOrders}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>

        {readyOrders.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <LocalShippingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune commande prête pour livraison
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les nouvelles commandes apparaîtront ici lorsqu'elles seront prêtes
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {readyOrders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order.orderId}>
                <Card sx={{ 
                  height: '100%',
                  '&:hover': { boxShadow: 6 }
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                      Commande #{order.orderId}
                    </Typography>
                    
                    {/* Info client */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {order.clientFullName}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {order.phoneNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Box component="span" sx={{ wordBreak: 'break-word' }}>
                          {order.deliveryAddress}
                        </Box>
                      </Typography>
                    </Box>
                    
                    {/* Info commande */}
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Articles:</strong> {order.items?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total:</strong> {parseFloat(order.totalAmount || 0).toFixed(2)}€
                      </Typography>
                    </Paper>
                    
                    {/* Actions */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => startDelivery(order.orderId)}
                      disabled={processing}
                      startIcon={<LocalShippingIcon />}
                    >
                      Prendre en charge
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Dialog Détails */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                Commande #{selectedOrder.orderId}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {/* Info client */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Informations client
                </Typography>
                <Typography variant="body2">{selectedOrder.clientFullName}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedOrder.phoneNumber}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedOrder.deliveryAddress}</Typography>
              </Box>
              
              {/* Articles */}
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Articles commandés
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Article</TableCell>
                    <TableCell align="right">Qté</TableCell>
                    <TableCell align="right">Prix</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.dishName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price?.toFixed(2)}€</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {selectedOrder.notes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> {selectedOrder.notes}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog Confirmation livraison */}
      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
        {confirmDialog && (
          <>
            <DialogTitle>
              <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
              Confirmer la livraison
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Marquer la commande #{confirmDialog.orderId} comme livrée ?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Client:</strong> {confirmDialog.clientFullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Adresse:</strong> {confirmDialog.deliveryAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Montant:</strong> {parseFloat(confirmDialog.totalAmount || 0).toFixed(2)}€
              </Typography>
              
              <TextField
                fullWidth
                label="Code de livraison (optionnel)"
                value={deliveryCode}
                onChange={(e) => setDeliveryCode(e.target.value)}
                sx={{ mt: 2 }}
                size="small"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialog(null)}>
                Annuler
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => markAsDelivered(confirmDialog.orderId)}
                disabled={processing}
                startIcon={<DoneAllIcon />}
              >
                {processing ? 'Traitement...' : 'Confirmer la livraison'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DeliveryOrders;