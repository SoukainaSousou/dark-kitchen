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
  Stack
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  LocalShipping,
  AttachMoney,
  ShoppingCart,
  AccessTime,
  Person,
  Notifications,
  CurrencyExchange
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const API_URL = "http://localhost:8080/api";

const StatCard = ({ title, value, change, icon, color = "primary", loading = false }) => {
  const colorMap = {
    primary: "#1976d2",
    secondary: "#9c27b0",
    success: "#2e7d32",
    error: "#d32f2f",
    warning: "#ed6c02",
    info: "#0288d1"
  };

  return (
    <Card sx={{ 
      height: "100%", 
      position: "relative", 
      boxShadow: 2,
      borderRadius: 3,
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
      }
    }}>
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color]}80 100%)`
      }} />
      <CardContent sx={{ pt: 3 }}>
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
                    <Chip
                      label={`${change > 0 ? "+" : ""}${change}%`}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: change > 0 ? '#e8f5e9' : '#ffebee',
                        color: change > 0 ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                        height: 22
                      }}
                    />
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

const RevenuePieChart = ({ orders = [], loading = false }) => {
  // Regrouper par statut et calculer les totaux
  const getStatusData = () => {
    const statusGroups = {};
    
    orders.forEach(order => {
      const status = order.status || 'INCONNU';
      if (!statusGroups[status]) {
        statusGroups[status] = {
          name: status,
          value: 0,
          count: 0,
          color: getStatusColor(status)
        };
      }
      statusGroups[status].value += order.totalAmount || 0;
      statusGroups[status].count += 1;
    });

    // Convertir en tableau et trier par montant
    return Object.values(statusGroups)
      .map(item => ({
        ...item,
        name: getStatusLabel(item.name)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'EN_ATTENTE': return "Nouvelles";
      case 'EN_PREPARATION': return "Préparation";
      case 'PRET': return "Prêtes";
      case 'EN_LIVRAISON': return "Livraison";
      case 'LIVRE': return "Livrées";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'EN_ATTENTE': return "#ff9800"; // Orange
      case 'EN_PREPARATION': return "#2196f3"; // Bleu
      case 'PRET': return "#4caf50"; // Vert
      case 'EN_LIVRAISON': return "#9c27b0"; // Violet
      case 'LIVRE': return "#00bcd4"; // Cyan
      default: return "#757575"; // Gris
    }
  };

  const chartData = getStatusData();
  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Chargement des revenus...
          </Typography>
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
              📊 Répartition du chiffre d'affaires
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {totalRevenue.toFixed(2)} €
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total des commandes
            </Typography>
          </Box>
          <CurrencyExchange sx={{ fontSize: 40, color: 'success.main' }} />
        </Box>

        {chartData.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Aucune donnée de revenus disponible
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
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value.toFixed(2)} €`,
                    `${props.payload.name} (${props.payload.count} commandes)`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Box mt={3}>
          <Grid container spacing={1}>
            {chartData.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {item.value.toFixed(2)}€
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};



const OrderStatusChart = ({ orders = [], loading = false }) => {
  const getStatusData = () => {
    const statusCounts = {
      'EN_ATTENTE': { name: "Nouvelles", color: "#ff9800", count: 0 },
      'EN_PREPARATION': { name: "Préparation", color: "#2196f3", count: 0 },
      'PRET': { name: "Prêtes", color: "#4caf50", count: 0 },
      'EN_LIVRAISON': { name: "Livraison", color: "#9c27b0", count: 0 },
      'LIVRE': { name: "Livrées", color: "#00bcd4", count: 0 },
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
              📈 Statut des commandes
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {totalOrders} total
            </Typography>
          </Box>
          <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>

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
              <Tooltip formatter={(value) => [`${value} commandes`]} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    preparingOrders: 0,
    deliveringOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Rafraîchir les données toutes les 15 secondes (plus rapide pour les nouvelles commandes)
    const interval = setInterval(fetchDashboardData, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer toutes les commandes
      const ordersResponse = await axios.get(`${API_URL}/orders/admin/all`);
      const allOrders = ordersResponse.data.orders || ordersResponse.data;
      setOrders(allOrders);
      
      // Calculer les statistiques
      const today = new Date().toISOString().split('T')[0];
      
      // Commandes d'aujourd'hui
      const todayOrders = allOrders.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt).toISOString().split('T')[0];
        return orderDate === today;
      });
      
      // Chiffre d'affaires d'aujourd'hui
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Chiffre d'affaires total
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Commandes par statut
      const preparingOrders = allOrders.filter(order => order.status === 'EN_PREPARATION').length;
      const deliveringOrders = allOrders.filter(order => order.status === 'EN_LIVRAISON').length;
      const pendingOrders = allOrders.filter(order => order.status === 'EN_ATTENTE').length;
      
      setStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        preparingOrders: preparingOrders,
        deliveringOrders: deliveringOrders,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders
      });
      
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setError("Impossible de charger les données du serveur. Affichage des données de démo.");
      
      // Données de démo
      setStats({
        todayOrders: 28,
        todayRevenue: 450.75,
        preparingOrders: 12,
        deliveringOrders: 8,
        totalRevenue: 2450.50,
        pendingOrders: 5
      });
      
      // Données de démo pour les commandes
      setOrders([
        { id: 1001, status: 'EN_ATTENTE', totalAmount: 24.50, orderDate: new Date().toISOString() },
        { id: 1002, status: 'EN_ATTENTE', totalAmount: 18.00, orderDate: new Date().toISOString() },
        { id: 1003, status: 'EN_PREPARATION', totalAmount: 32.75, orderDate: new Date().toISOString() },
        { id: 1004, status: 'EN_PREPARATION', totalAmount: 15.50, orderDate: new Date().toISOString() },
        { id: 1005, status: 'PRET', totalAmount: 22.00, orderDate: new Date().toISOString() },
        { id: 1006, status: 'EN_LIVRAISON', totalAmount: 19.99, orderDate: new Date().toISOString() },
        { id: 1007, status: 'LIVRE', totalAmount: 28.50, orderDate: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* En-tête avec indicateur de mise à jour */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
              📊 Dashboard Administrateur
            </Typography>
            <Typography color="text.secondary">
              Vue d'ensemble en temps réel - Mise à jour automatique
            </Typography>
          </Box>
          <Chip 
            label={loading ? "Chargement..." : "En ligne"} 
            color={loading ? "warning" : "success"}
            icon={loading ? <CircularProgress size={16} /> : null}
          />
        </Box>
      </Box>

      {/* Message d'erreur */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques principales avec couleurs vives */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes aujourd'hui"
            value={stats.todayOrders}
            change={15}
            icon={<ShoppingCart />}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En préparation"
            value={stats.preparingOrders}
            change={-3}
            icon={<Restaurant />}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nouvelles commandes"
            value={stats.pendingOrders}
            change={25}
            icon={<Notifications />}
            color="error"
            loading={loading}
          />
        </Grid>
         <Grid item xs={12}>
              <Card sx={{ 
                boxShadow: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                color: 'white'
              }}>
                <CardContent>
                  <Grid container alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="h6" gutterBottom color="white">
                        💰 Chiffre d'affaires total
                      </Typography>
                      <Typography variant="h2" fontWeight="bold" color="white">
                        {stats.totalRevenue.toFixed(2)} €
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        Cumul de toutes les commandes
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <CurrencyExchange sx={{ fontSize: 60, opacity: 0.8 }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
      </Grid>

      {/* Section principale avec diagrammes */}
      <Grid container spacing={3}>
        {/* Colonne gauche - Chiffre d'affaires et nouvelles commandes */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
          
            {/* Graphique de répartition du CA */}
            <Grid item xs={12} md={6}>
              <RevenuePieChart orders={orders} loading={loading} />
            </Grid>
          </Grid>
        </Grid>

        {/* Colonne droite - Statut des commandes et infos supplémentaires */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Diagramme circulaire des statuts */}
            <Grid item xs={12}>
              <OrderStatusChart orders={orders} loading={loading} />
            </Grid>

            {/* Statistiques supplémentaires */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📋 Résumé rapide
                  </Typography>
                  
                  <Stack spacing={2} mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <LocalShipping sx={{ color: '#9c27b0', mr: 1 }} />
                        <Typography variant="body2">En livraison</Typography>
                      </Box>
                      <Chip 
                        label={stats.deliveringOrders} 
                        size="small" 
                        sx={{ backgroundColor: '#9c27b0', color: 'white' }}
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Restaurant sx={{ color: '#2196f3', mr: 1 }} />
                        <Typography variant="body2">En cuisine</Typography>
                      </Box>
                      <Chip 
                        label={stats.preparingOrders} 
                        size="small" 
                        sx={{ backgroundColor: '#2196f3', color: 'white' }}
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <AccessTime sx={{ color: '#4caf50', mr: 1 }} />
                        <Typography variant="body2">Prêtes</Typography>
                      </Box>
                      <Chip 
                        label={orders.filter(o => o.status === 'PRET').length} 
                        size="small" 
                        sx={{ backgroundColor: '#4caf50', color: 'white' }}
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Person sx={{ color: '#00bcd4', mr: 1 }} />
                        <Typography variant="body2">Livrées (total)</Typography>
                      </Box>
                      <Chip 
                        label={orders.filter(o => o.status === 'LIVRE').length} 
                        size="small" 
                        sx={{ backgroundColor: '#00bcd4', color: 'white' }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;