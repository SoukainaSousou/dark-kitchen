import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
   Button
} from '@mui/material';
import { orderService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';

const ChefReadyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, PRET, LIVREE
  const [stats, setStats] = useState({
    ready: 0,
    delivered: 0,
    today: 0
  });

  // Charger les commandes
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getCurrentUser();
      if (!user) {
        setError('Veuillez vous connecter');
        navigate('/login');
        return;
      }
      
      const isChef = user.role && ['CHEF', 'chef', 'ADMIN', 'admin'].includes(user.role);
      if (!isChef) {
        setError('Accès réservé aux cuisiniers');
        navigate('/');
        return;
      }
      
      setCurrentUser(user);
      
      // Charger TOUTES les commandes et filtrer côté frontend
      const allOrders = await orderService.getAllOrders();
      
      // Filtrer pour ne garder que les commandes préparées par ce cuisinier
      // Pour l'instant, on garde toutes les commandes PRET et LIVREE
      const chefOrders = allOrders.filter(order => 
        order.status === 'PRET' || order.status === 'LIVREE'
      );
      
      setOrders(chefOrders);
      
      // Calculer les statistiques
      const readyCount = chefOrders.filter(o => o.status === 'PRET').length;
      const deliveredCount = chefOrders.filter(o => o.status === 'LIVREE').length;
      
      // Commandes aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = chefOrders.filter(order => {
        if (!order.orderDate) return false;
        const orderDate = new Date(order.orderDate);
        return orderDate >= today;
      }).length;
      
      setStats({
        ready: readyCount,
        delivered: deliveredCount,
        today: todayCount
      });
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les commandes selon le filtre sélectionné
  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'PRET') return order.status === 'PRET';
    if (filter === 'LIVREE') return order.status === 'LIVREE';
    return true;
  });

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

  // Temps écoulé depuis la préparation
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Il y a ${diffDays}j`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    loadOrders();
    
    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(loadOrders, 60000);
    return () => clearInterval(interval);
  }, []);

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
          <CheckCircleIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Commandes Préparées
        </Typography>
        <Typography color="text.secondary">
          Votre travail accompli - {stats.delivered} commande(s) livrée(s)
        </Typography>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.ready}</Typography>
              <Typography variant="body2">En attente de livraison</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <DoneAllIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.delivered}</Typography>
              <Typography variant="body2">Livrées avec succès</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <RestaurantIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.today}</Typography>
              <Typography variant="body2">Préparées aujourd'hui</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres et bouton rafraîchir */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          <ToggleButton value="ALL">
            <Badge 
              badgeContent={orders.length} 
              color="primary"
              sx={{ mr: 1 }}
            >
              <FilterListIcon fontSize="small" sx={{ mr: 1 }} />
              Toutes
            </Badge>
          </ToggleButton>
          <ToggleButton value="PRET">
            <Badge 
              badgeContent={stats.ready} 
              color="info"
              sx={{ mr: 1 }}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Prêtes
            </Badge>
          </ToggleButton>
          <ToggleButton value="LIVREE">
            <Badge 
              badgeContent={stats.delivered} 
              color="success"
              sx={{ mr: 1 }}
            >
              <DoneAllIcon fontSize="small" sx={{ mr: 1 }} />
              Livrées
            </Badge>
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<RestaurantIcon />}
            label={`${filteredOrders.length} commande(s)`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<RefreshIcon />}
            label="Actualiser"
            onClick={loadOrders}
            disabled={loading}
            color="primary"
            variant="outlined"
            clickable
          />
        </Box>
      </Box>

      {/* Commandes */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune commande {filter !== 'ALL' ? 
                (filter === 'PRET' ? 'prête' : 'livrée') : 
                'trouvée'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filter === 'PRET' ? 'Les commandes prêtes apparaîtront ici' :
               filter === 'LIVREE' ? 'Les commandes livrées apparaîtront ici' :
               'Aucune commande préparée pour le moment'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => {
            const isDelivered = order.status === 'LIVREE';
            const isReady = order.status === 'PRET';
            
            return (
              <Grid item xs={12} md={6} lg={4} key={order.orderId}>
                <Card sx={{ 
                  height: '100%',
                  position: 'relative',
                  borderLeft: '4px solid',
                  borderColor: isDelivered ? 'success.main' : 'info.main',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}>
                  {/* En-tête avec statut */}
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: isDelivered ? 'success.light' : 'info.light',
                    color: isDelivered ? 'success.dark' : 'info.dark',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Commande #{order.orderId}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                    <Chip
                      icon={isDelivered ? <DoneAllIcon /> : <CheckCircleIcon />}
                      label={isDelivered ? 'Livrée' : 'Prête'}
                      color={isDelivered ? 'success' : 'info'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <CardContent>
                    {/* Client */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          fontSize: '1rem'
                        }}
                      >
                        {order.clientFullName?.charAt(0).toUpperCase() || 'C'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {order.clientFullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getTimeAgo(order.orderDate)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Articles */}
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />
                        Votre préparation
                      </Typography>
                      
                      <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
                        {order.items?.map((item, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            py: 0.5,
                            borderBottom: index < order.items.length - 1 ? '1px dashed #e0e0e0' : 'none'
                          }}>
                            <Typography variant="body2">
                              {item.quantity} × {item.dishName}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {(item.quantity * (item.price || 0)).toFixed(2)}€
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" fontWeight="bold">Total préparé</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {parseFloat(order.totalAmount || 0).toFixed(2)}€
                        </Typography>
                      </Box>
                    </Paper>

                    {/* État de livraison */}
                    {isDelivered ? (
                      <Alert 
                        severity="success" 
                        icon={<DoneAllIcon />}
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="body2">
                          <strong>Livrée avec succès</strong>
                          <br />
                          <Typography variant="caption" component="span">
                            Client satisfait de votre préparation
                          </Typography>
                        </Typography>
                      </Alert>
                    ) : (
                      <Alert 
                        severity="info" 
                        icon={<LocalShippingIcon />}
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="body2">
                          <strong>En attente du livreur</strong>
                          <br />
                          <Typography variant="caption" component="span">
                            Votre plat est prêt pour la livraison
                          </Typography>
                        </Typography>
                      </Alert>
                    )}

                    {/* Barre de progression symbolique */}
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Préparation
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isDelivered ? 'Livraison' : 'En cours'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={isDelivered ? 100 : 50}
                        color={isDelivered ? 'success' : 'primary'}
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'grey.200'
                        }}
                      />
                    </Box>
                  </CardContent>

                  {/* Note de satisfaction (simulée pour les livrées) */}
                  {isDelivered && (
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'success.50', 
                      borderTop: '1px solid',
                      borderColor: 'success.100'
                    }}>
                      <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Préparation réussie • Satisfaction client garantie
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Résumé en bas */}
      {filteredOrders.length > 0 && (
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Récapitulatif
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vous avez préparé {filteredOrders.length} commande(s){' '}
                  {filter === 'PRET' ? 'actuellement prêtes' : 
                   filter === 'LIVREE' ? 'déjà livrées' : 
                   'au total'}
                </Typography>
                
                {filter === 'ALL' && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                      {stats.ready} en attente de livraison
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <DoneAllIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      {stats.delivered} déjà livrées
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Moyenne de préparation: ~20-25 minutes par commande
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  {stats.today > 0 ? `Aujourd'hui: ${stats.today} commande(s) préparée(s)` : 'Aucune préparation aujourd\'hui'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ChefReadyOrders;