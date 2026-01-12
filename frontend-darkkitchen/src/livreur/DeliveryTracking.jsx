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
  TextField,
  Paper,
  Divider
} from '@mui/material';
import { orderService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import HistoryIcon from '@mui/icons-material/History';

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [recentDelivered, setRecentDelivered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionType, setActionType] = useState(null); // 'delivered' or 'failed'

  // Charger les commandes en cours de livraison
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
      
      // Charger les commandes EN_LIVRAISON (avec la nouvelle méthode)
      const inDelivery = await orderService.getOrdersInDelivery();
      setActiveDeliveries(inDelivery);
      
      // Charger les commandes LIVRÉES pour l'historique
      const delivered = await orderService.getOrdersByStatus('LIVREE');
      const nonDelivered = await orderService.getOrdersByStatus('NON_LIVREE');
      
      // Combiner et trier
      const recent = [...delivered, ...nonDelivered]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 10);
      
      setRecentDelivered(recent);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  // Marquer comme livrée
  const markAsDelivered = async (orderId) => {
    try {
      setProcessing(true);
      
      // Préparer la note de livraison
      const note = deliveryNote || 'Livré avec succès';
      
      // Changer le statut à LIVREE
      await orderService.updateOrderStatus(orderId, 'LIVREE', 'livreur');
      
      setSuccessMessage(`Commande #${orderId} marquée comme livrée avec succès!`);
      setConfirmDialog(null);
      setDeliveryNote('');
      setActionType(null);
      
      // Recharger les commandes
      await loadDeliveryOrders();
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la confirmation de livraison');
    } finally {
      setProcessing(false);
    }
  };

  // Marquer comme non livrée
  const markAsFailed = async (orderId) => {
    try {
      setProcessing(true);
      
      if (!deliveryNote.trim()) {
        setError('Veuillez indiquer la raison de l\'échec de livraison');
        return;
      }
      
      // Changer le statut à NON_LIVREE
      await orderService.updateOrderStatus(orderId, 'NON_LIVREE', 'livreur');
      
      setSuccessMessage(`Commande #${orderId} marquée comme non livrée.`);
      setConfirmDialog(null);
      setDeliveryNote('');
      setActionType(null);
      
      // Recharger les commandes
      await loadDeliveryOrders();
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la déclaration d\'échec');
    } finally {
      setProcessing(false);
    }
  };

  // Ouvrir le dialog de confirmation
  const openConfirmDialog = (order, type) => {
    setConfirmDialog(order);
    setActionType(type);
    setDeliveryNote(type === 'failed' ? '' : 'Livré avec succès');
  };

  // Calculer le temps écoulé depuis la prise en charge
  const getElapsedTime = (orderDate) => {
    if (!orderDate) return '--:--';
    
    try {
      const start = new Date(orderDate);
      const now = new Date();
      const diffMinutes = Math.floor((now - start) / (1000 * 60));
      
      if (diffMinutes < 60) {
        return `${diffMinutes} min`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}h${minutes > 0 ? `${minutes}min` : ''}`;
      }
    } catch (error) {
      return '--:--';
    }
  };

  // Obtenir le statut de livraison
  const getDeliveryStatus = (order) => {
    const status = order.status;
    if (status === 'LIVREE') {
      return { label: 'LIVRÉE', color: 'success' };
    } else if (status === 'NON_LIVREE') {
      return { label: 'NON LIVRÉE', color: 'error' };
    } else if (status === 'EN_LIVRAISON') {
      return { label: 'EN LIVRAISON', color: 'warning' };
    } else {
      return { label: status, color: 'default' };
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Rafraîchir automatiquement
  useEffect(() => {
    loadDeliveryOrders();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadDeliveryOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && activeDeliveries.length === 0 && recentDelivered.length === 0) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement des livraisons...</Typography>
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
          <LocalShippingIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Suivi des Livraisons
        </Typography>
        <Typography color="text.secondary">
          En cours: {activeDeliveries.length} • Récentes: {recentDelivered.length}
        </Typography>
      </Box>

      {/* Commandes en cours de livraison */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <TwoWheelerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Livraisons en cours ({activeDeliveries.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadDeliveryOrders}
              disabled={loading}
              size="small"
            >
              Actualiser
            </Button>
          </Box>

          {activeDeliveries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LocalShippingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune livraison en cours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prenez une commande dans la zone livraison pour commencer
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Commande</strong></TableCell>
                  <TableCell><strong>Client</strong></TableCell>
                  <TableCell><strong>Adresse</strong></TableCell>
                 
                  <TableCell><strong>Montant</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeDeliveries.map((order) => (
                  <TableRow key={order.orderId} hover>
                    <TableCell>
                      <Typography fontWeight="bold">
                        #{order.orderId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.items?.length || 0} article(s)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{order.clientFullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.phoneNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {order.deliveryAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">
                        {parseFloat(order.totalAmount || 0).toFixed(2)}€
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Voir détails">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedOrder(order)}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => openConfirmDialog(order, 'delivered')}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Livré
                        </Button>
                        
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => openConfirmDialog(order, 'failed')}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Échec
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Livraisons récentes */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Historique des livraisons
            </Typography>
          </Box>

          {recentDelivered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AssignmentLateIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Aucune livraison récente
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {recentDelivered.map((order) => {
                const status = getDeliveryStatus(order);
                return (
                  <Grid item xs={12} md={6} key={order.orderId}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography fontWeight="bold">
                          Commande #{order.orderId}
                        </Typography>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {order.clientFullName}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {order.deliveryAddress?.substring(0, 50)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          {formatDate(order.orderDate)}
                        </Typography>
                        <Typography fontWeight="bold">
                          {parseFloat(order.totalAmount || 0).toFixed(2)}€
                        </Typography>
                      </Box>
                      
                      {order.notes && (
                        <Alert 
                          severity="info" 
                          sx={{ mt: 2, py: 0.5 }}
                          icon={false}
                        >
                          <Typography variant="body2" fontSize="0.8rem">
                            {order.notes}
                          </Typography>
                        </Alert>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Dialog Détails de la commande */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                Détails Commande #{selectedOrder.orderId}
              </Typography>
              <Chip
                label={getDeliveryStatus(selectedOrder).label}
                color={getDeliveryStatus(selectedOrder).color}
                size="small"
                sx={{ mt: 1 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              {/* Info client */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Informations client
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2">
                    <strong>Nom:</strong> {selectedOrder.clientFullName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Téléphone:</strong> {selectedOrder.phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedOrder.clientEmail || 'Non fourni'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Adresse:</strong> {selectedOrder.deliveryAddress}
                  </Typography>
                </Box>
              </Box>
              
              {/* Date de commande */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Date:</strong> {formatDate(selectedOrder.orderDate)}
              </Typography>
              
              {/* Articles */}
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Articles commandés
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Article</TableCell>
                    <TableCell align="right">Qté</TableCell>
                    <TableCell align="right">Prix unitaire</TableCell>
                    <TableCell align="right">Sous-total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.dishName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price?.toFixed(2)}€</TableCell>
                      <TableCell align="right">{item.subtotal?.toFixed(2)}€</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                    <TableCell align="right"><strong>{parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}€</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {/* Notes du client */}
              {selectedOrder.notes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Note client:</strong> {selectedOrder.notes}
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

      {/* Dialog Confirmation livraison/échec */}
      <Dialog open={!!confirmDialog} onClose={() => {
        setConfirmDialog(null);
        setActionType(null);
        setDeliveryNote('');
      }}>
        {confirmDialog && (
          <>
            <DialogTitle>
              {actionType === 'delivered' ? (
                <>
                  <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
                  Confirmer la livraison
                </>
              ) : (
                <>
                  <CancelIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />
                  Déclarer l'échec de livraison
                </>
              )}
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                {actionType === 'delivered' 
                  ? `Confirmer que la commande #${confirmDialog.orderId} a été livrée ?`
                  : `Déclarer que la commande #${confirmDialog.orderId} n'a pas pu être livrée ?`}
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Client:</strong> {confirmDialog.clientFullName}
                </Typography>
                <Typography variant="body2">
                  <strong>Adresse:</strong> {confirmDialog.deliveryAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Montant:</strong> {parseFloat(confirmDialog.totalAmount || 0).toFixed(2)}€
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={actionType === 'failed' ? 3 : 2}
                label={actionType === 'failed' ? "Raison de l'échec *" : "Note de livraison (optionnel)"}
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                sx={{ mt: 3 }}
                size="small"
                required={actionType === 'failed'}
                placeholder={actionType === 'failed' ? "Ex: Client absent, adresse incorrecte..." : "Ex: Livré au portier, appartement 3B..."}
              />
              
              {actionType === 'failed' && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  * Ce champ est obligatoire pour déclarer un échec de livraison
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setConfirmDialog(null);
                  setActionType(null);
                  setDeliveryNote('');
                }}
                disabled={processing}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color={actionType === 'delivered' ? 'success' : 'error'}
                onClick={() => actionType === 'delivered' 
                  ? markAsDelivered(confirmDialog.orderId) 
                  : markAsFailed(confirmDialog.orderId)
                }
                disabled={processing || (actionType === 'failed' && !deliveryNote.trim())}
                startIcon={actionType === 'delivered' ? <CheckCircleIcon /> : <CancelIcon />}
              >
                {processing ? 'Traitement...' : (actionType === 'delivered' ? 'Confirmer' : 'Déclarer échec')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DeliveryTracking;