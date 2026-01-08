import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Button, CircularProgress, Alert, Card, CardContent,
  Grid, TextField, MenuItem, Select, InputLabel, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Badge, Avatar, AvatarGroup, IconButton,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Icône de nourriture
import { orderService, authService } from '../services/api';

// Configuration des statuts (adaptée à vos statuts)
const statusConfig = {
  'EN_ATTENTE': {
    label: 'En attente',
    color: 'warning',
    icon: <PendingIcon fontSize="small" />,
    description: 'Commande en attente de confirmation'
  },
  'EN_PREPARATION': {
    label: 'En préparation',
    color: 'primary',
    icon: <RestaurantIcon fontSize="small" />,
    description: 'Vos plats sont en cours de préparation'
  },
  'EN_LIVRAISON': {
    label: 'En livraison',
    color: 'secondary',
    icon: <TwoWheelerIcon fontSize="small" />,
    description: 'Votre livreur est en route'
  },
  'LIVRÉE': {
    label: 'Livrée',
    color: 'success',
    icon: <DoneAllIcon fontSize="small" />,
    description: 'Commande livrée avec succès'
  },
  'ANNULEE': {
    label: 'Annulée',
    color: 'error',
    icon: <CancelIcon fontSize="small" />,
    description: 'Commande annulée'
  }
};

// Composant Avatar avec icône de nourriture
const FoodAvatar = ({ size = 60 }) => (
  <Avatar 
    sx={{ 
      width: size, 
      height: size,
      bgcolor: 'primary.light',
      color: 'primary.contrastText'
    }}
    variant="rounded"
  >
    <FastfoodIcon fontSize={size === 60 ? "large" : "medium"} />
  </Avatar>
);

// Composant Avatar petit pour les badges
const SmallFoodAvatar = () => (
  <Avatar 
    sx={{ 
      width: 32, 
      height: 32,
      bgcolor: 'primary.light',
      color: 'primary.contrastText'
    }}
  >
    <FastfoodIcon fontSize="small" />
  </Avatar>
);

// Composant pour une ligne détaillée
const OrderRowDetails = ({ order }) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Détails de la commande #{order.orderNumber || order.orderId}
            </Typography>
            <Grid container spacing={3}>
              {/* Articles */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Articles ({order.items?.length || 0})
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {order.items?.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < order.items.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item>
                            <FoodAvatar />
                          </Grid>
                          <Grid item xs>
                            <Typography variant="body1" fontWeight="medium">
                              {item.dishName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} × {item.price?.toFixed(2)}€
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                              {item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}€
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Informations */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {/* Livraison */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Informations de livraison
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2">
                          <strong>Adresse:</strong> {order.deliveryAddress}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Téléphone:</strong> {order.phoneNumber}
                        </Typography>
                        {order.notes && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Notes:</strong> {order.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Contact */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Contact
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2">
                          <strong>Nom:</strong> {order.clientFullName}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Email:</strong> {order.clientEmail}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Total */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Total
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary" align="center">
                          {order.totalAmount?.toFixed(2)}€
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {order.orderDate && new Date(order.orderDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Charger l'utilisateur et les commandes
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est connecté
      const user = authService.getCurrentUser();
      console.log('MyOrders: Loaded user:', user);
      
      if (!user || !user.id) {
        setError('Veuillez vous connecter pour voir vos commandes');
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      
      // Récupérer les commandes depuis l'API
      const filters = {
        status: statusFilter !== 'TOUS' ? statusFilter : undefined,
        sortBy: sortBy
      };
      
      console.log('Loading orders with filters:', filters);
      const ordersData = await orderService.getClientOrders(user.id, filters);
      console.log('MyOrders: Orders loaded from API:', ordersData);
      
      setOrders(ordersData);
      applySearchFilter(ordersData, searchTerm);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err.message || 'Erreur lors du chargement de vos commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, sortBy]);

  // Appliquer le filtre de recherche
  const applySearchFilter = (ordersList, search) => {
    if (!search.trim()) {
      setFilteredOrders(ordersList);
      return;
    }
    
    const term = search.toLowerCase();
    const filtered = ordersList.filter(order => 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(term)) ||
      (order.orderId && order.orderId.toString().includes(term)) ||
      (order.clientFullName && order.clientFullName.toLowerCase().includes(term)) ||
      (order.clientEmail && order.clientEmail.toLowerCase().includes(term)) ||
      (order.items && order.items.some(item => 
        item.dishName && item.dishName.toLowerCase().includes(term)
      ))
    );
    
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    applySearchFilter(orders, searchTerm);
  }, [searchTerm, orders]);

  // Rafraîchir les commandes
  const refreshOrders = async () => {
    await loadOrders();
  };

  // Gérer l'expansion des détails
  const handleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Annuler une commande
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        setLoading(true);
        await orderService.cancelOrder(orderId, 'Annulé par le client');
        await refreshOrders();
      } catch (err) {
        setError(err.message || 'Erreur lors de l\'annulation de la commande');
      } finally {
        setLoading(false);
      }
    }
  };

  // Commander à nouveau
  const handleReorder = async (orderId) => {
    try {
      setLoading(true);
      const result = await orderService.reorder(orderId);
      
      if (result.success) {
        // Rediriger vers le panier
        navigate('/cart');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la réorganisation');
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Afficher le statut
  const renderStatusChip = (status) => {
    const config = statusConfig[status] || statusConfig.EN_ATTENTE;
    return (
      <Chip
        label={config.label}
        color={config.color}
        icon={config.icon}
        size="small"
        sx={{ fontWeight: 'medium' }}
      />
    );
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setStatusFilter('TOUS');
    setSearchTerm('');
    setSortBy('createdAt_desc');
  };

  if (loading && !orders.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#e91e63' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement de vos commandes...
        </Typography>
      </Container>
    );
  }

  if (error && !currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <LocalShippingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Accès non autorisé
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error}
          </Typography>
          <Button 
            variant="contained"
            onClick={() => navigate('/cart')}
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' }
            }}
          >
            Retour au panier
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          <LocalShippingIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Mes Commandes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consultez l'historique et le statut de toutes vos commandes
        </Typography>
      </Box>

      {/* Filtres simplifiés */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="TOUS">Toutes les commandes</MenuItem>
                <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                <MenuItem value="EN_PREPARATION">En préparation</MenuItem>
                <MenuItem value="EN_LIVRAISON">En livraison</MenuItem>
                <MenuItem value="LIVRÉE">Livrées</MenuItem>
                <MenuItem value="ANNULEE">Annulées</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Trier par"
              >
                <MenuItem value="createdAt_desc">Plus récent</MenuItem>
                <MenuItem value="createdAt_asc">Plus ancien</MenuItem>
                <MenuItem value="total_desc">Montant (haut)</MenuItem>
                <MenuItem value="total_asc">Montant (bas)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              onClick={handleResetFilters}
              variant="outlined"
              color="secondary"
              size="small"
            >
              Réinitialiser
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {orders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commandes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {orders.filter(o => o.status === 'LIVRÉE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Livrées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {orders.filter(o => ['EN_ATTENTE', 'EN_PREPARATION', 'EN_LIVRAISON'].includes(o.status)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En cours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {orders.filter(o => o.status === 'ANNULEE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Annulées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <LocalShippingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Aucune commande trouvée
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {searchTerm || statusFilter !== 'TOUS'
              ? 'Aucune commande ne correspond à vos critères'
              : 'Vous n\'avez pas encore passé de commande'}
          </Typography>
          <Button 
            variant="contained"
            onClick={() => navigate('/menu')}
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#ad1457' },
              px: 4
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Commander maintenant
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell width="80px"></TableCell>
                <TableCell width="140px">N° Commande</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Articles</TableCell>
                <TableCell align="center" width="200px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.orderId}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleExpandOrder(order.orderId)}
                      >
                        {expandedOrder === order.orderId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        #{order.orderNumber || `CMD-${order.orderId}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {renderStatusChip(order.status)}
                        {statusConfig[order.status]?.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {statusConfig[order.status].description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight="bold" color="#e91e63">
                        {order.totalAmount?.toFixed(2)}€
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Badge 
                        badgeContent={order.items?.length || 0} 
                        color="primary"
                        sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}
                      >
                        <AvatarGroup max={3}>
                          {order.items?.slice(0, 3).map((item, index) => (
                            <SmallFoodAvatar key={index} />
                          ))}
                        </AvatarGroup>
                      </Badge>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleExpandOrder(order.orderId)}
                        >
                          Détails
                        </Button>
                        
                        {(order.status === 'EN_ATTENTE' || order.status === 'EN_PREPARATION') && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelOrder(order.orderId)}
                          >
                            Annuler
                          </Button>
                        )}
                        
                        {order.status === 'LIVRÉE' && (
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleReorder(order.orderId)}
                          >
                            Recommander
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {expandedOrder === order.orderId && (
                    <OrderRowDetails order={order} />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Bouton de rafraîchissement */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={refreshOrders}
          startIcon={<ReplayIcon />}
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': { backgroundColor: '#ad1457' }
          }}
        >
          Actualiser la liste
        </Button>
      </Box>
    </Container>
  );
};

export default MyOrders;