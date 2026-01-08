import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  LinearProgress,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  TablePagination,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TimerIcon from '@mui/icons-material/Timer';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ReplayIcon from '@mui/icons-material/Replay';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { orderService, authService, utilsService } from '../services/api';

// Composant de statut avec indicateur visuel
const StatusIndicator = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'EN_ATTENTE':
        return {
          color: '#ff9800',
          label: 'En attente',
          icon: <PendingIcon fontSize="small" />,
          progress: 10
        };
      case 'EN_PREPARATION':
        return {
          color: '#2196f3',
          label: 'En préparation',
          icon: <KitchenIcon fontSize="small" />,
          progress: 40
        };
      case 'PRET':
        return {
          color: '#4caf50',
          label: 'Prête',
          icon: <CheckCircleIcon fontSize="small" />,
          progress: 70
        };
      case 'EN_LIVRAISON':
        return {
          color: '#ff5722',
          label: 'En livraison',
          icon: <LocalShippingIcon fontSize="small" />,
          progress: 90
        };
      case 'LIVREE':
        return {
          color: '#009688',
          label: 'Livrée',
          icon: <CheckCircleIcon fontSize="small" />,
          progress: 100
        };
      case 'ANNULEE':
        return {
          color: '#f44336',
          label: 'Annulée',
          icon: <CancelIcon fontSize="small" />,
          progress: 0
        };
      default:
        return {
          color: '#757575',
          label: status,
          icon: <AccessTimeIcon fontSize="small" />,
          progress: 0
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Tooltip title={config.label}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          bgcolor: config.color + '20',
          color: config.color
        }}>
          {config.icon}
        </Box>
        <Typography variant="body2" sx={{ color: config.color, fontWeight: 500 }}>
          {config.label}
        </Typography>
      </Box>
    </Tooltip>
  );
};

// Composant de progression
const ProgressBar = ({ status }) => {
  const getProgress = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 10;
      case 'EN_PREPARATION': return 40;
      case 'PRET': return 70;
      case 'EN_LIVRAISON': return 90;
      case 'LIVREE': return 100;
      case 'ANNULEE': return 0;
      default: return 0;
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return '#ff9800';
      case 'EN_PREPARATION': return '#2196f3';
      case 'PRET': return '#4caf50';
      case 'EN_LIVRAISON': return '#ff5722';
      case 'LIVREE': return '#009688';
      case 'ANNULEE': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress 
        variant="determinate" 
        value={getProgress(status)} 
        sx={{ 
          height: 6,
          borderRadius: 3,
          bgcolor: getColor(status) + '20',
          '& .MuiLinearProgress-bar': {
            bgcolor: getColor(status),
            borderRadius: 3
          }
        }}
      />
    </Box>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [sortBy, setSortBy] = useState('date_desc');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Statuts disponibles
  const STATUS_OPTIONS = [
    { value: 'TOUS', label: 'Toutes les commandes' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'EN_PREPARATION', label: 'En préparation' },
    { value: 'PRET', label: 'Prêtes' },
    { value: 'EN_LIVRAISON', label: 'En livraison' },
    { value: 'LIVREE', label: 'Livrées' },
    { value: 'ANNULEE', label: 'Annulées' }
  ];

  // Charger l'utilisateur et ses commandes
  useEffect(() => {
    const loadData = async () => {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        navigate('/auth');
        return;
      }
      
      setUser(currentUser);
      await fetchOrders(currentUser.id);
    };

    loadData();

    // Configurer le rafraîchissement automatique pour les commandes actives
    const interval = setInterval(() => {
      if (user) {
        refreshActiveOrders();
      }
    }, 30000); // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval);
  }, [navigate, user]);

  // Rafraîchir uniquement les commandes actives
  const refreshActiveOrders = async () => {
    if (!user) return;
    
    try {
      const activeStatuses = ['EN_ATTENTE', 'EN_PREPARATION', 'EN_LIVRAISON'];
      const hasActiveOrders = orders.some(order => activeStatuses.includes(order.status));
      
      if (hasActiveOrders) {
        console.log('Rafraîchissement automatique des commandes actives');
        await fetchOrders(user.id);
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement automatique:', err);
    }
  };

  // Récupérer les commandes depuis l'API
  const fetchOrders = async (clientId) => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {
        status: statusFilter !== 'TOUS' ? statusFilter : undefined,
        sortBy: sortBy
      };
      
      const ordersData = await orderService.getClientOrders(clientId, filters);
      setOrders(ordersData);
      
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Impossible de charger vos commandes. Veuillez réessayer.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Annuler une commande
  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      setError('Veuillez indiquer une raison d\'annulation');
      return;
    }

    setCancelling(true);
    
    try {
      const result = await orderService.cancelOrder(selectedOrder.id, cancelReason);
      
      if (result.success) {
        // Mettre à jour la liste des commandes
        await fetchOrders(user.id);
        
        setSuccess(`Commande #${selectedOrder.id} annulée avec succès`);
        setCancelDialogOpen(false);
        setSelectedOrder(null);
        setCancelReason('');
      } else {
        throw new Error(result.message);
      }
      
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'annulation de la commande');
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  // Commander à nouveau
  const handleReorder = async (orderId) => {
    try {
      const result = await orderService.reorder(orderId);
      
      if (result.success) {
        setSuccess('Commande recréée avec succès ! Redirection vers le panier...');
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la recréation de la commande');
    }
  };

  // Rafraîchir manuellement
  const handleRefresh = async () => {
    if (user) {
      setLoading(true);
      await fetchOrders(user.id);
      setSuccess('Liste des commandes rafraîchie');
    }
  };

  // Ouvrir le dialogue d'annulation
  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  // Ouvrir les détails d'une commande
  const openOrderDetails = async (orderId) => {
    try {
      const order = await orderService.getOrderById(orderId);
      setSelectedOrder(order);
      setOrderDialogOpen(true);
    } catch (err) {
      setError('Impossible de charger les détails de la commande');
      console.error(err);
    }
  };

  // Vérifier si une commande peut être annulée
  const canCancelOrder = (order) => {
    return order.canCancel === true;
  };

  // Obtenir le temps restant pour annuler
  const getCancelTimeRemaining = (deadline) => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    
    if (diffMs <= 0) return null;
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer le changement de filtre
  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [statusFilter, sortBy]);

  // Calculer les statistiques
  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'EN_ATTENTE').length,
      preparing: orders.filter(o => o.status === 'EN_PREPARATION').length,
      delivering: orders.filter(o => o.status === 'EN_LIVRAISON').length,
      delivered: orders.filter(o => o.status === 'LIVREE').length,
      cancelled: orders.filter(o => o.status === 'ANNULEE').length
    };
  };

  const stats = getStats();

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement de vos commandes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={stats.pending + stats.preparing + stats.delivering} color="error">
              <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Badge>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Mes Commandes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Historique et suivi de vos commandes
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            {loading ? 'Rafraîchissement...' : 'Actualiser'}
          </Button>
        </Box>
        <Divider />
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light' }}>
            <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
            <Typography variant="body2">Total</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light' }}>
            <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
            <Typography variant="body2">En attente</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light' }}>
            <Typography variant="h4" fontWeight="bold">{stats.preparing}</Typography>
            <Typography variant="body2">En préparation</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light' }}>
            <Typography variant="h4" fontWeight="bold">{stats.delivering}</Typography>
            <Typography variant="body2">En livraison</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light' }}>
            <Typography variant="h4" fontWeight="bold">{stats.delivered}</Typography>
            <Typography variant="body2">Livrées</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.300' }}>
            <Typography variant="h4" fontWeight="bold">{stats.cancelled}</Typography>
            <Typography variant="body2">Annulées</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres et tri */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon fontSize="small" />
                  Filtrer par statut
                </Box>
              </InputLabel>
              <Select
                value={statusFilter}
                label="Filtrer par statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SortIcon fontSize="small" />
                  Trier par
                </Box>
              </InputLabel>
              <Select
                value={sortBy}
                label="Trier par"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date_desc">Date (plus récent)</MenuItem>
                <MenuItem value="date_asc">Date (plus ancien)</MenuItem>
                <MenuItem value="amount_desc">Montant (plus élevé)</MenuItem>
                <MenuItem value="amount_asc">Montant (plus bas)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" align="center">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} trouvée{orders.length !== 1 ? 's' : ''}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des commandes */}
      {orders.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <HistoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
            Aucune commande trouvée
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {statusFilter === 'TOUS' 
              ? "Vous n'avez pas encore passé de commande."
              : `Aucune commande avec le statut "${STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}".`}
          </Typography>
          {statusFilter !== 'TOUS' && (
            <Button
              variant="outlined"
              onClick={() => setStatusFilter('TOUS')}
              sx={{ mr: 2 }}
            >
              Voir toutes les commandes
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => navigate('/menu')}
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            Commander maintenant
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Commande</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Progression</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Articles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Montant</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    const timeRemaining = getCancelTimeRemaining(order.cancellationDeadline);
                    const canCancel = canCancelOrder(order);
                    
                    return (
                      <TableRow 
                        key={order.id} 
                        hover
                        sx={{ 
                          '&:hover': { bgcolor: 'action.hover' },
                          cursor: 'pointer'
                        }}
                        onClick={() => openOrderDetails(order.id)}
                      >
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            #{order.orderNumber || order.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.deliveryAddress ? order.deliveryAddress.substring(0, 30) + '...' : 'N/A'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {utilsService.formatDate(order.orderDate)}
                          </Typography>
                          {order.estimatedDelivery && (
                            <Typography variant="caption" color="text.secondary">
                              Livraison: {utilsService.formatDate(order.estimatedDelivery)}
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <StatusIndicator status={order.status} />
                          {canCancel && timeRemaining && (
                            <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                              <TimerIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              Annulation: {timeRemaining}
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell sx={{ width: 150 }}>
                          <ProgressBar status={order.status} />
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {order.items && order.items.slice(0, 2).map((item, index) => (
                              <Chip
                                key={index}
                                label={`${item.quantity}x ${item.name}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {order.items && order.items.length > 2 && (
                              <Chip
                                label={`+${order.items.length - 2}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold" color="primary">
                            {utilsService.formatPrice(order.totalAmount)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Voir les détails">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderDetails(order.id);
                                }}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {canCancel && (
                              <Tooltip title="Annuler la commande">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCancelDialog(order);
                                  }}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {order.status === 'LIVREE' && (
                              <Tooltip title="Commander à nouveau">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReorder(order.id);
                                  }}
                                  color="success"
                                >
                                  <ReplayIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </>
      )}

      {/* Dialog de détails de commande */}
      <Dialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RestaurantIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Détails de la commande #{selectedOrder.orderNumber || selectedOrder.id}
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  <StatusIndicator status={selectedOrder.status} />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                    Informations de commande
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date et heure:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {utilsService.formatDate(selectedOrder.orderDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Livraison estimée:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.estimatedDelivery 
                        ? utilsService.formatDate(selectedOrder.estimatedDelivery)
                        : 'Non disponible'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Contact:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.phoneNumber || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Adresse de livraison:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.deliveryAddress || 'N/A'}
                    </Typography>
                  </Box>
                  
                  {selectedOrder.notes && (
                    <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Notes spéciales
                      </Typography>
                      <Typography variant="body2">
                        "{selectedOrder.notes}"
                      </Typography>
                    </Box>
                  )}
                  
                  {selectedOrder.cancellationReason && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error">
                        Raison d'annulation
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.cancellationReason}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                    Détails des articles
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                          <TableCell>Article</TableCell>
                          <TableCell align="right">Qté</TableCell>
                          <TableCell align="right">Prix unit.</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{utilsService.formatPrice(item.price)}</TableCell>
                            <TableCell align="right" fontWeight="bold">
                              {utilsService.formatPrice(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Sous-total:</Typography>
                      <Typography variant="body2">{utilsService.formatPrice(selectedOrder.subtotal || 0)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Frais de livraison:</Typography>
                      <Typography variant="body2">{utilsService.formatPrice(selectedOrder.deliveryFee || 0)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">TVA (10%):</Typography>
                      <Typography variant="body2">{utilsService.formatPrice(selectedOrder.tax || 0)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">Total:</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {utilsService.formatPrice(selectedOrder.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOrderDialogOpen(false)}>Fermer</Button>
              {canCancelOrder(selectedOrder) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setOrderDialogOpen(false);
                    openCancelDialog(selectedOrder);
                  }}
                >
                  Annuler la commande
                </Button>
              )}
              {selectedOrder.status === 'LIVREE' && (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleReorder(selectedOrder.id)}
                  sx={{ 
                    backgroundColor: '#e91e63',
                    '&:hover': { backgroundColor: '#ad1457' }
                  }}
                >
                  Commander à nouveau
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog d'annulation */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CancelIcon color="error" />
                <Typography variant="h6" fontWeight="bold">
                  Annuler la commande #{selectedOrder.orderNumber || selectedOrder.id}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Attention : L'annulation est définitive
                </Typography>
                {selectedOrder.cancellationDeadline && (
                  <Typography variant="body2">
                    Vous pouvez annuler votre commande jusqu'au {utilsService.formatDate(selectedOrder.cancellationDeadline)}
                  </Typography>
                )}
              </Alert>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Veuillez indiquer la raison de l'annulation :
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Exemple : J'ai changé d'avis, temps d'attente trop long, double commande, etc."
                variant="outlined"
                disabled={cancelling}
              />
              
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Récapitulatif de la commande à annuler
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.items.length} article{selectedOrder.items.length > 1 ? 's' : ''} • 
                    Total: {utilsService.formatPrice(selectedOrder.totalAmount)}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setCancelDialogOpen(false)}
                disabled={cancelling}
              >
                Retour
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                startIcon={cancelling ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              >
                {cancelling ? 'Annulation en cours...' : 'Confirmer l\'annulation'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;