// src/pages/ChefDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Button,
  IconButton
} from "@mui/material";
import {
  Restaurant,
  LocalFireDepartment,
  CheckCircle,
  AccessTime,
  TrendingUp,
  TrendingDown,
  Refresh,
  Timer,
  Kitchen,
  EmojiEvents,
  RestaurantMenu,
  HourglassEmpty
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { orderService } from '../services/api';

const StatCard = ({ title, value, change, icon, color = "warning", loading = false }) => {
  const colorMap = {
    warning: "#ed6c02",
    error: "#d32f2f",
    success: "#2e7d32",
    info: "#0288d1",
    primary: "#1976d2"
  };

  return (
    <Card sx={{ 
      height: "100%", 
      boxShadow: 2,
      borderRadius: 3,
      borderLeft: `4px solid ${colorMap[color]}`,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Box display="flex" alignItems="center" height={40}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {value}
                </Typography>
                {change !== undefined && (
                  <Box display="flex" alignItems="center" mt={1}>
                    {change > 0 ? (
                      <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: change > 0 ? "success.main" : "error.main",
                        ml: 0.5,
                        fontWeight: 'medium'
                      }}
                    >
                      {change > 0 ? "+" : ""}{change}%
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${colorMap[color]}15`,
              p: 1.5,
              borderRadius: 2,
              color: colorMap[color]
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const OrdersStatusChart = ({ orders = [], loading = false }) => {
  const getStatusData = () => {
    const statusCounts = {
      'EN_ATTENTE': { name: "En attente", color: "#ff9800", count: 0 },
      'EN_PREPARATION': { name: "En préparation", color: "#2196f3", count: 0 },
      'PRET': { name: "Prêtes", color: "#4caf50", count: 0 },
      'EN_LIVRAISON': { name: "En livraison", color: "#9c27b0", count: 0 },
      'LIVRE': { name: "Livrées", color: "#00bcd4", count: 0 },
      'ANNULE': { name: "Annulées", color: "#757575", count: 0 }
    };

    orders.forEach(order => {
      if (order.status && statusCounts[order.status]) {
        statusCounts[order.status].count++;
      }
    });

    return Object.values(statusCounts);
  };

  const chartData = getStatusData();
  const totalOrders = chartData.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📊 Statut des commandes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {totalOrders} commandes
            </Typography>
          </Box>
          <Restaurant sx={{ fontSize: 40, color: 'warning.main' }} />
        </Box>

        {totalOrders === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Aucune commande en cuisine
          </Typography>
        ) : (
          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} commandes`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Box mt={3}>
          {chartData.map((item, index) => (
            <Box key={index} mb={2}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">{item.name}</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {item.count}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${item.color}20`,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const UrgentOrdersList = ({ orders = [], loading = false, onUpdateStatus }) => {
  // Commandes en attente + en préparation = urgentes pour le chef
  const urgentOrders = orders
    .filter(order => order.status === 'EN_ATTENTE' || order.status === 'EN_PREPARATION')
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch(status) {
      case 'EN_ATTENTE': return "#ff9800";
      case 'EN_PREPARATION': return "#2196f3";
      case 'PRET': return "#4caf50";
      default: return "#757575";
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'EN_ATTENTE': return "En attente";
      case 'EN_PREPARATION': return "En préparation";
      case 'PRET': return "Prête";
      default: return status;
    }
  };

  const handleStartPreparation = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'EN_PREPARATION', 'chef');
      onUpdateStatus(); // Rafraîchir les données
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'PRET', 'chef');
      onUpdateStatus(); // Rafraîchir les données
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

 
};

const RecentOrdersTable = ({ orders = [], loading = false }) => {
  const recentOrders = orders.slice(0, 4);

  if (loading) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📝 Commandes récentes
        </Typography>
        
        {recentOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            Aucune commande récente
          </Typography>
        ) : (
          <Stack spacing={1} mt={2}>
            {recentOrders.map((order) => (
              <Paper key={order.id} sx={{ p: 1.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      #{order.id} - {order.clientName || 'Client'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.orderDate || order.createdAt).toLocaleString('fr-FR')}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      backgroundColor: 
                        order.status === 'EN_ATTENTE' ? '#FFF3E0' :
                        order.status === 'EN_PREPARATION' ? '#E3F2FD' :
                        order.status === 'PRET' ? '#E8F5E9' : '#F5F5F5',
                      color: 'text.primary'
                    }}
                  />
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

const ChefDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedToday: 0
  });
  const [orders, setOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les commandes pour le chef (vous pouvez ajuster selon vos endpoints)
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
      
      // Calculer les statistiques
      const pendingOrders = allOrders.filter(o => o.status === 'EN_ATTENTE').length;
      const preparingOrders = allOrders.filter(o => o.status === 'EN_PREPARATION').length;
      const readyOrders = allOrders.filter(o => o.status === 'PRET').length;
      
      // Commandes terminées aujourd'hui (LIVRE)
      const today = new Date().toISOString().split('T')[0];
      const completedToday = allOrders.filter(o => 
        o.status === 'LIVRE' && 
        new Date(o.orderDate || o.createdAt).toISOString().split('T')[0] === today
      ).length;
      
      setStats({
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedToday
      });
      
      setError(null);
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setError("Impossible de charger les données. Vérifiez votre connexion.");
      
      // Données de démo si l'API échoue
      setOrders([
        { id: 1001, status: 'EN_ATTENTE', clientName: 'Mohamed', orderDate: new Date().toISOString() },
        { id: 1002, status: 'EN_PREPARATION', clientName: 'Fatima', orderDate: new Date().toISOString() },
        { id: 1003, status: 'PRET', clientName: 'Karim', orderDate: new Date().toISOString() },
        { id: 1004, status: 'EN_ATTENTE', clientName: 'Sarah', orderDate: new Date().toISOString() },
      ]);
      
      setStats({
        pendingOrders: 2,
        preparingOrders: 1,
        readyOrders: 1,
        completedToday: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="warning.dark">
            👨‍🍳 Tableau de bord Cuisine
          </Typography>
          <Typography color="text.secondary">
            Gestion des commandes en temps réel
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Chip 
            label={loading ? "Chargement..." : `${orders.length} commandes`} 
            color={loading ? "warning" : "info"}
            icon={loading ? <CircularProgress size={16} /> : null}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Message d'erreur */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En attente"
            value={stats.pendingOrders}
            icon={<HourglassEmpty />}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En préparation"
            value={stats.preparingOrders}
            icon={<Restaurant />}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Prêtes"
            value={stats.readyOrders}
            icon={<CheckCircle />}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Terminées"
            value={stats.completedToday}
            icon={<EmojiEvents />}
            color="primary"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Section principale */}
      <Grid container spacing={3}>
        {/* Colonne gauche - Graphique et récentes */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Graphique de statut */}
            <Grid item xs={12}>
              <OrdersStatusChart orders={orders} loading={loading} />
            </Grid>
            
            {/* Commandes récentes */}
            <Grid item xs={12}>
              <RecentOrdersTable orders={orders} loading={loading} />
            </Grid>
          </Grid>
        </Grid>

        {/* Colonne droite - Commandes urgentes */}
        <Grid item xs={12} lg={4}>
          <UrgentOrdersList 
            orders={orders} 
            loading={loading}
            onUpdateStatus={fetchDashboardData}
          />
        </Grid>
      </Grid>

      {/* Résumé rapide */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF3E0', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💡 Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<Restaurant />}
              onClick={() => window.location.href = '/chef/orders?status=EN_ATTENTE'}
            >
              Voir en attente
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              startIcon={<Kitchen />}
              onClick={() => window.location.href = '/chef/orders?status=EN_PREPARATION'}
            >
              Voir en cours
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => window.location.href = '/chef/orders?status=PRET'}
            >
              Voir prêtes
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<Timer />}
              onClick={() => window.location.href = '/chef/profil'}
            >
              Mon profil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ChefDashboard;