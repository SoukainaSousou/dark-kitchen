import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Badge
} from "@mui/material";
import { orderService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Configuration des statuts avec actions spécifiques
const statusConfig = {
  'EN_ATTENTE': {
    label: 'En attente',
    color: 'warning',
    icon: <PendingIcon />,
    bgColor: '#FFF3E0',
    description: 'En attente de confirmation'
  },
  'EN_PREPARATION': {
    label: 'En préparation',
    color: 'primary',
    icon: <RestaurantIcon />,
    bgColor: '#E3F2FD',
    description: 'En cours de préparation'
  },
  'PRET': {
    label: 'Prêt',
    color: 'info',
    icon: <CheckCircleIcon />,
    bgColor: '#E0F7FA',
    description: 'Prêt pour livraison'
  },
  'EN_LIVRAISON': {
    label: 'En livraison',
    color: 'secondary',
    icon: <LocalShippingIcon />,
    bgColor: '#F3E5F5',
    description: 'En cours de livraison'
  },
  'LIVREE': {
    label: 'Livrée',
    color: 'success',
    icon: <CheckCircleIcon />,
    bgColor: '#E8F5E9',
    description: 'Commande livrée'
  },
  'ANNULEE': {
    label: 'Annulée',
    color: 'error',
    icon: <CancelIcon />,
    bgColor: '#FFEBEE',
    description: 'Commande annulée'
  }
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Charger les commandes
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier l'utilisateur
      const user = authService.getCurrentUser();
      console.log('User:', user);
      
      if (!user) {
        setError('Veuillez vous connecter');
        navigate('/login');
        return;
      }
      
      // Vérifier si c'est un admin
      const isAdmin = user.role && ['ADMIN', 'admin'].includes(user.role);
      
      if (!isAdmin) {
        setError('Accès réservé aux administrateurs');
        navigate('/');
        return;
      }
      
      setCurrentUser(user);
      
      // Charger les commandes
      const ordersData = await orderService.getAllOrders();
      console.log('Orders loaded:', ordersData);
      
      setOrders(ordersData);
      applyFilters(ordersData, searchTerm, statusFilter);
      
      // Simuler des notifications
      const newNotifications = ordersData
        .filter(order => order.status === 'EN_ATTENTE')
        .map(order => ({
          id: order.orderId,
          type: 'NEW_ORDER',
          message: `Nouvelle commande #${order.orderId} de ${order.clientFullName}`,
          time: 'Juste maintenant',
          read: false
        }));
      
      setNotifications(newNotifications);
      
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  // Accepter une commande (Admin seulement)
  const acceptOrder = async (orderId) => {
    try {
      setUpdating(true);
      
      // Changer le statut à EN_PREPARATION
      await orderService.updateOrderStatus(orderId, 'EN_PREPARATION', 'admin');
      
      // Simuler une notification au cuisinier
      const order = orders.find(o => o.orderId === orderId);
      if (order) {
        setSuccessMessage(`Commande #${orderId} acceptée et notifiée au cuisinier!`);
        
        // Simuler l'envoi de notification au cuisinier
        console.log(`Notification au cuisinier: Nouvelle commande #${orderId} à préparer`);
      }
      
      // Mettre à jour localement
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? { ...order, status: 'EN_PREPARATION' } : order
        )
      );
      
      // Retirer de la liste des notifications
      setNotifications(prev => prev.filter(n => n.id !== orderId));
      
    } catch (err) {
      console.error('Erreur acceptation commande:', err);
      setError(err.message || 'Erreur lors de l\'acceptation de la commande');
    } finally {
      setUpdating(false);
    }
  };

  // Refuser/Annuler une commande
  const rejectOrder = async (orderId, reason = 'Refusé par l\'administrateur') => {
    try {
      setUpdating(true);
      
      await orderService.cancelOrder(orderId, reason);
      
      // Mettre à jour localement
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? { ...order, status: 'ANNULEE' } : order
        )
      );
      
      setCancelOrder(null);
      setSuccessMessage(`Commande #${orderId} refusée/annulée`);
      
      // Retirer de la liste des notifications
      setNotifications(prev => prev.filter(n => n.id !== orderId));
      
    } catch (err) {
      console.error('Erreur refus commande:', err);
      setError(err.message || 'Erreur lors du refus de la commande');
    } finally {
      setUpdating(false);
    }
  };

  // Forcer l'annulation d'une commande (pour les commandes en préparation)
  const forceCancelOrder = async (orderId) => {
    try {
      setUpdating(true);
      
      await orderService.cancelOrder(orderId, 'Annulée par l\'administrateur (urgence)');
      
      // Mettre à jour localement
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? { ...order, status: 'ANNULEE' } : order
        )
      );
      
      setSuccessMessage(`Commande #${orderId} annulée avec succès`);
      
    } catch (err) {
      console.error('Erreur annulation forcée:', err);
      setError(err.message || 'Erreur lors de l\'annulation');
    } finally {
      setUpdating(false);
    }
  };

  // Appliquer les filtres
  const applyFilters = (ordersList, search, status) => {
    let filtered = [...ordersList];
    
    // Recherche
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(order => 
        (order.orderId && order.orderId.toString().includes(term)) ||
        (order.clientFullName && order.clientFullName.toLowerCase().includes(term)) ||
        (order.clientEmail && order.clientEmail.toLowerCase().includes(term)) ||
        (order.phoneNumber && order.phoneNumber.includes(term))
      );
    }
    
    // Filtre par statut
    if (status !== 'TOUS') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    // Trier par date (plus récent d'abord)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    setFilteredOrders(filtered);
  };

  // Marquer toutes les notifications comme lues
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    loadOrders();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters(orders, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, orders]);

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Calculer les statistiques
  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const totalRevenue = orders
    .filter(order => order.status === 'LIVREE')
    .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

  // Commandes en attente (pour admin)
  const pendingOrdersCount = getStatusCount('EN_ATTENTE');

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
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
          >
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={5000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Header avec notifications */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {notifications.length > 0 && (
              <Badge badgeContent={notifications.length} color="error">
                <Button
                  variant="outlined"
                  startIcon={<NotificationsActiveIcon />}
                  onClick={markAllNotificationsAsRead}
                >
                  Notifications
                </Button>
              </Badge>
            )}
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadOrders}
              disabled={loading}
            >
              Actualiser
            </Button>
          </Box>
        </Box>

        {/* Afficher les notifications non lues */}
        {notifications.length > 0 && (
          <Alert 
            severity="info" 
            icon={<NotificationsActiveIcon />}
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={markAllNotificationsAsRead}>
                Tout marquer comme lu
              </Button>
            }
          >
            <Typography variant="body2">
              {notifications.length} nouvelle(s) commande(s) en attente de confirmation
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.keys(statusConfig).map((status) => (
          <Grid item xs={6} sm={4} md={2} key={status}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s',
                  bgcolor: statusConfig[status].bgColor 
                }
              }}
              onClick={() => setStatusFilter(status)}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: `${statusConfig[status].color}.light`,
                  color: `${statusConfig[status].color}.main`,
                  mb: 1 
                }}>
                  {statusConfig[status].icon}
                </Box>
                <Typography variant="h5" fontWeight="bold">{getStatusCount(status)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {statusConfig[status].label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtres et recherche */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher commande, client, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="TOUS">Tous les statuts</MenuItem>
              {Object.keys(statusConfig).map((status) => (
                <MenuItem key={status} value={status}>
                  {statusConfig[status].label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('TOUS');
              }}
              size="small"
            >
              Réinitialiser
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Tableau des commandes */}
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>N° Commande</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.orderId} 
                hover
                sx={{ 
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:last-child td': { border: 0 }
                }}
              >
                <TableCell>
                  <Typography fontWeight="bold" color="primary">
                    #{order.orderId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography fontWeight="medium">{order.clientFullName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {order.clientEmail}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.phoneNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(order.orderDate)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color="primary" variant="h6">
                    {parseFloat(order.totalAmount || 0).toFixed(2)}€
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={statusConfig[order.status]?.icon}
                    label={statusConfig[order.status]?.label || order.status}
                    color={statusConfig[order.status]?.color || 'default'}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      fontWeight: 'medium',
                      bgcolor: statusConfig[order.status]?.bgColor
                    }}
                  />
                  {statusConfig[order.status]?.description && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {statusConfig[order.status].description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {/* Actions spécifiques selon le statut */}
                    {order.status === 'EN_ATTENTE' && (
                      <>
                        <Tooltip title="Accepter la commande">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ThumbUpIcon />}
                            onClick={() => acceptOrder(order.orderId)}
                            disabled={updating}
                            sx={{ minWidth: 'auto' }}
                          >
                            Accepter
                          </Button>
                        </Tooltip>
                        <Tooltip title="Refuser la commande">
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<ThumbDownIcon />}
                            onClick={() => setCancelOrder(order)}
                            disabled={updating}
                            sx={{ minWidth: 'auto' }}
                          >
                            Refuser
                          </Button>
                        </Tooltip>
                      </>
                    )}
                    
                    {(order.status === 'EN_PREPARATION' || order.status === 'PRET' || order.status === 'EN_LIVRAISON') && (
                      <Tooltip title="Forcer l'annulation">
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => forceCancelOrder(order.orderId)}
                          disabled={updating}
                          sx={{ minWidth: 'auto' }}
                        >
                          Annuler
                        </Button>
                      </Tooltip>
                    )}
                    
                    {/* Bouton détails pour toutes les commandes */}
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && !loading && (
          <Box p={6} textAlign="center">
            <LocalShippingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune commande trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || statusFilter !== 'TOUS' 
                ? 'Aucune commande ne correspond à vos critères de recherche' 
                : 'Aucune commande dans le système'}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={loadOrders}
              startIcon={<RefreshIcon />}
            >
              Recharger
            </Button>
          </Box>
        )}
      </Card>

      {/* Dialog Détails de commande */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Commande #{selectedOrder.orderId}
                </Typography>
                <Chip
                  icon={statusConfig[selectedOrder.status]?.icon}
                  label={statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                  color={statusConfig[selectedOrder.status]?.color || 'default'}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent dividers sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Informations client */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations client
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography fontWeight="medium">{selectedOrder.clientFullName}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedOrder.clientEmail}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedOrder.phoneNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedOrder.deliveryAddress}</Typography>
                    </Box>
                    {selectedOrder.notes && (
                      <Alert 
                        severity="info" 
                        sx={{ mt: 2 }}
                        icon={<FastfoodIcon />}
                      >
                        <Typography variant="body2">
                          <strong>Notes spéciales:</strong> {selectedOrder.notes}
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                </Grid>
                
                {/* Informations commande */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations commande
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Date et heure
                        </Typography>
                        <Typography>{formatDate(selectedOrder.orderDate)}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Statut actuel
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {statusConfig[selectedOrder.status]?.icon}
                          <Typography fontWeight="medium">
                            {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Total de la commande
                        </Typography>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}€
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Articles commandés */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <FastfoodIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Articles commandés ({selectedOrder.items?.length || 0})
                  </Typography>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Article</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell align="right">Prix unitaire</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {item.dishName}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{item.price?.toFixed(2)}€</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {(item.quantity * (item.price || 0)).toFixed(2)}€
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ borderTop: 2 }}>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="h6" fontWeight="bold">
                              Total
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h5" color="primary" fontWeight="bold">
                              {parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}€
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography color="text.secondary">
                        Aucun détail d'article disponible
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </Button>
              
              {/* Actions dans le dialog selon le statut */}
              {selectedOrder.status === 'EN_ATTENTE' && (
                <>
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<ThumbUpIcon />}
                    onClick={() => {
                      acceptOrder(selectedOrder.orderId);
                      setSelectedOrder(null);
                    }}
                    disabled={updating}
                  >
                    Accepter la commande
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<ThumbDownIcon />}
                    onClick={() => {
                      setCancelOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    disabled={updating}
                  >
                    Refuser
                  </Button>
                </>
              )}
              
              {(selectedOrder.status === 'EN_PREPARATION' || selectedOrder.status === 'PRET' || selectedOrder.status === 'EN_LIVRAISON') && (
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    forceCancelOrder(selectedOrder.orderId);
                    setSelectedOrder(null);
                  }}
                  disabled={updating}
                >
                  Forcer l'annulation
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de confirmation d'annulation */}
      <Dialog
        open={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <CancelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Confirmer le refus/annulation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir refuser/annuler la commande #{cancelOrder?.orderId} ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Client:</strong> {cancelOrder?.clientFullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Montant:</strong> {parseFloat(cancelOrder?.totalAmount || 0).toFixed(2)}€
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible. Le client sera notifié du refus de sa commande.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOrder(null)}>
            Annuler
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<CancelIcon />}
            onClick={() => rejectOrder(cancelOrder.orderId)}
            disabled={updating}
          >
            {updating ? 'Traitement...' : 'Confirmer le refus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;