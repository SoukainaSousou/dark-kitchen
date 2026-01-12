import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Button,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  AccessTime,
  LocalShipping,
  DirectionsCar,
  MonetizationOn,
  Map,
  Phone,
  CheckCircle,
  Warning,
  Speed,
  LocationOn,
  Person,
  Schedule,
  Straighten,
  Update
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { orderService, authService } from "../services/api";

// Composant de carte statistique réutilisable
const DriverStatCard = ({ title, value, icon, color = "primary", unit = "", subtitle = "" }) => (
  <Card sx={{ height: "100%", boxShadow: 2, borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            {value}{unit}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: 2, color: color }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Composant Livraison Active
const ActiveDelivery = ({ delivery, onUpdateStatus, onCall }) => {
  if (!delivery) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🚚 Aucune livraison active
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aucune livraison en cours pour le moment
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", boxShadow: 2, bgcolor: "#E3F2FD" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocalShipping color="primary" />
          <Typography variant="h6" fontWeight="bold">
            🚚 Livraison en cours
          </Typography>
          <Chip label="Active" color="primary" size="small" />
        </Box>
        
        <Paper sx={{ p: 2, mb: 2, bgcolor: "white" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography fontWeight="bold">#{delivery.id}</Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {delivery.totalAmount}€
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {delivery.items?.map(item => item.name).join(", ") || "Aucun détail"}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2">
              {delivery.client?.fullName || "Client inconnu"}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">
              {delivery.deliveryAddress || "Adresse non spécifiée"}
            </Typography>
          </Box>
        </Paper>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, textAlign: 'center' }}>
              <AccessTime color="warning" />
              <Typography variant="h6" fontWeight="bold">
                {delivery.estimatedDeliveryTime || "20"}min
              </Typography>
              <Typography variant="caption">Temps estimé</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, textAlign: 'center' }}>
              <Straighten color="info" />
              <Typography variant="h6" fontWeight="bold">
                {delivery.distance || "2.5"}km
              </Typography>
              <Typography variant="caption">Distance</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            startIcon={<Phone />}
            onClick={() => onCall(delivery.client?.phoneNumber)}
          >
            Appeler
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => onUpdateStatus(delivery.id, 'LIVREE')}
          >
            Marquer comme livré
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Composant Prochaines Livraisons
const NextDeliveries = ({ deliveries, onSelect }) => {
  if (!deliveries || deliveries.length === 0) {
    return (
      <Card sx={{ height: "100%", boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📋 Aucune prochaine livraison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aucune livraison planifiée
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📋 Prochaines livraisons
        </Typography>
        
        <List>
          {deliveries.slice(0, 3).map((delivery, index) => (
            <div key={delivery.id}>
              <ListItem 
                sx={{ 
                  p: 2,
                  '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
                }}
                onClick={() => onSelect(delivery)}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    {delivery.client?.fullName?.charAt(0) || 'C'}
                  </Avatar>
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold">
                        #{delivery.id} • {delivery.client?.fullName || 'Client'}
                      </Typography>
                      <Typography fontWeight="bold" color="primary">
                        {delivery.totalAmount}€
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {delivery.deliveryAddress}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">
                          {delivery.estimatedDeliveryTime || "15"}min
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < deliveries.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Composant Gains du Jour
const EarningsToday = ({ earnings }) => {
  const total = earnings?.total || 0;

  return (
    <Card sx={{ height: "100%", boxShadow: 2, bgcolor: "#FFF3E0" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <MonetizationOn color="warning" />
          <Typography variant="h6" fontWeight="bold" color="warning.dark">
            💰 Gains aujourd'hui
          </Typography>
        </Box>
        
        <Box textAlign="center" my={3}>
          <Typography variant="h1" fontWeight="bold" color="warning.dark">
            {total.toFixed(2)}€
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
        
        <Stack spacing={1}>
          <Paper sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
            <Typography>Livraisons</Typography>
            <Typography fontWeight="bold">{earnings?.deliveryFees?.toFixed(2) || "0.00"}€</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
            <Typography>Pourboires</Typography>
            <Typography fontWeight="bold">{earnings?.tips?.toFixed(2) || "0.00"}€</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
            <Typography>Bonus</Typography>
            <Typography fontWeight="bold">{earnings?.bonus?.toFixed(2) || "0.00"}€</Typography>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Composant Carte Interactive
const DeliveryMap = ({ deliveries }) => {
  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Map color="primary" />
          <Typography variant="h6" fontWeight="bold">
            🗺️ Carte des livraisons
          </Typography>
        </Box>
        
        {/* Carte SVG simplifiée */}
        <Box sx={{ 
          height: 200, 
          bgcolor: "#E3F2FD", 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          mb: 2
        }}>
          {/* Représentation visuelle de la carte */}
          <svg width="100%" height="100%" viewBox="0 0 400 200">
            {/* Fond de carte */}
            <rect width="400" height="200" fill="#90CAF9" />
            
            {/* Routes (routes principales) */}
            <path d="M50,100 L150,50 L250,150 L350,100" stroke="#1976D2" strokeWidth="3" fill="none" />
            <path d="M100,150 L200,50 L300,100" stroke="#2196F3" strokeWidth="2" fill="none" />
            
            {/* Points de livraison */}
            {deliveries.slice(0, 5).map((delivery, index) => {
              const x = 50 + (index * 70);
              const y = 50 + (index % 3) * 50;
              
              return (
                <g key={index}>
                  <circle 
                    cx={x} cy={y} r="8" 
                    fill="#FF9800" 
                    stroke="white" 
                    strokeWidth="2"
                  />
                  <text 
                    x={x} y={y - 12} 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill="#333"
                    fontWeight="bold"
                  >
                    #{delivery.id}
                  </text>
                </g>
              );
            })}
            
            {/* Position du chauffeur (centre) */}
            <circle 
              cx="200" cy="100" r="10" 
              fill="#2196F3" 
              stroke="white" 
              strokeWidth="3"
            />
            <text 
              x="200" y="100" 
              textAnchor="middle" 
              dy="4" 
              fontSize="12" 
              fill="white"
              fontWeight="bold"
            >
              Vous
            </text>
          </svg>
          
          {/* Légende */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 10, 
            right: 10, 
            bgcolor: 'rgba(255,255,255,0.9)', 
            p: 1, 
            borderRadius: 1,
            fontSize: '12px'
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box sx={{ width: 8, height: 8, bgcolor: '#2196F3', borderRadius: '50%' }} />
              <span>Votre position</span>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 8, height: 8, bgcolor: '#FF9800', borderRadius: '50%' }} />
              <span>Livraisons ({deliveries.length})</span>
            </Box>
          </Box>
        </Box>
        
        <Grid container spacing={1} mt={2}>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#E3F2FD' }}>
              <Typography variant="body2" fontWeight="bold">
                📍 {deliveries.length} points
              </Typography>
              <Typography variant="caption">Livraisons</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#E8F5E9' }}>
              <Typography variant="body2" fontWeight="bold">
                🚗 {deliveries.length * 2.5}km
              </Typography>
              <Typography variant="caption">Distance totale</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#FFF3E0' }}>
              <Typography variant="body2" fontWeight="bold">
                ⏱️ {deliveries.length * 15}min
              </Typography>
              <Typography variant="caption">Temps estimé</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<DirectionsCar />}
          sx={{ mt: 2 }}
          onClick={() => {
            // Ouvrir Google Maps dans un nouvel onglet
            window.open('https://www.google.com/maps', '_blank');
          }}
        >
          Ouvrir la navigation
        </Button>
      </CardContent>
    </Card>
  );
};

// Dashboard principal
const DriverDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [nextDeliveries, setNextDeliveries] = useState([]);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    todayEarnings: 0,
    distance: 0,
    avgTime: 0,
    onTimeRate: 94,
    rating: 4.6,
    todayTips: 0,
    monthlyCompleted: 285,
    monthlyTarget: 400
  });
  const [earnings, setEarnings] = useState({
    total: 0,
    deliveryFees: 0,
    tips: 0,
    bonus: 0
  });
  const [driverInfo, setDriverInfo] = useState({
    name: '',
    vehicle: 'Scooter',
    licensePlate: '',
    fuelLevel: 68,
    mileage: 1560,
    nextMaintenance: 15
  });

  // Fonction pour charger les données
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // Charger les livraisons actives (EN_LIVRAISON)
      const activeDeliveries = await orderService.getOrdersInDelivery();
      if (activeDeliveries.length > 0) {
        setActiveDelivery(activeDeliveries[0]);
      }

      // Charger les livraisons prêtes pour livraison (PRET)
      const readyDeliveries = await orderService.getReadyOrdersForDelivery();
      setNextDeliveries(readyDeliveries.slice(0, 5));

      // Calculer les statistiques
      const totalDeliveries = readyDeliveries.length + activeDeliveries.length;
      const totalEarnings = readyDeliveries.reduce((sum, order) => sum + (order.totalAmount || 0), 0) +
                           activeDeliveries.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Mettre à jour les stats
      const newStats = {
        todayDeliveries: totalDeliveries,
        todayEarnings: totalEarnings,
        distance: totalDeliveries * 2.5,
        avgTime: 18,
        onTimeRate: 94,
        rating: 4.6,
        todayTips: totalEarnings * 0.1,
        monthlyCompleted: 285,
        monthlyTarget: 400
      };
      setStats(newStats);

      // Mettre à jour les gains
      setEarnings({
        total: totalEarnings,
        deliveryFees: totalEarnings * 0.8,
        tips: totalEarnings * 0.1,
        bonus: totalEarnings * 0.1
      });

      // Mettre à jour les infos du chauffeur
      setDriverInfo({
        name: user.fullName || user.email?.split('@')[0] || 'Chauffeur',
        vehicle: user.vehicleType || 'Scooter',
        licensePlate: user.licensePlate || '',
        fuelLevel: 68,
        mileage: 1560,
        nextMaintenance: 15
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une commande
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, 'DRIVER');
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Appeler le client
  const handleCallClient = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  // Sélectionner une livraison
  const handleSelectDelivery = (delivery) => {
    console.log('Livraison sélectionnée:', delivery);
  };

  // Actualiser les données
  const handleRefresh = () => {
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚚 Tableau de bord livreur
          </Typography>
          <Typography color="text.secondary">
            Bonjour {driverInfo.name}, prêt pour les livraisons du jour ?
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={online ? "En service" : "Hors ligne"}
            color={online ? "success" : "default"}
            icon={online ? <CheckCircle /> : <Warning />}
          />
          <Button 
            variant="outlined" 
            onClick={() => setOnline(!online)}
            startIcon={<Update />}
          >
            {online ? "Fin de service" : "Commencer"}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            startIcon={<Update />}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Alertes */}
      {!online && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setOnline(true)}>
              Activer
            </Button>
          }
        >
          Vous êtes actuellement hors ligne. Activez-vous pour recevoir des livraisons.
        </Alert>
      )}

      {/* Stats principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Livraisons aujourd'hui"
            value={stats.todayDeliveries}
            icon={<LocalShipping />}
            color="#2196F3"
            subtitle="en attente: +2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Gains totaux"
            value={stats.todayEarnings.toFixed(2)}
            unit="€"
            icon={<MonetizationOn />}
            color="#4CAF50"
            subtitle={`+${stats.todayTips.toFixed(2)}€ pourboires`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Distance"
            value={stats.distance.toFixed(1)}
            unit="km"
            icon={<Straighten />}
            color="#FF9800"
            subtitle="Moyenne 22km/h"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Temps moyen"
            value={stats.avgTime}
            unit="min"
            icon={<Speed />}
            color="#9C27B0"
            subtitle="-3min vs hier"
          />
        </Grid>
      </Grid>

      {/* Section principale avec carte */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DeliveryMap deliveries={nextDeliveries} />
            </Grid>
 <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📈 Mes performances
              </Typography>
              
              <Grid container spacing={2} mt={2}>
                {[
                  { label: "Ponctualité", value: 94, color: "#4CAF50", target: 95 },
                  { label: "Satisfaction", value: 4.6, color: "#2196F3", target: 4.5 },
                  { label: "Livraisons/jour", value: stats.todayDeliveries, color: "#FF9800", target: 15 },
                  { label: "Pourboires", value: stats.todayTips, color: "#9C27B0", target: 15 },
                ].map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color={stat.color}>
                        {stat.value}
                        {stat.label === "Pourboires" ? "€" : stat.label === "Satisfaction" ? "/5" : "%"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stat.value / stat.target) * 100}
                        sx={{ 
                          mt: 1, 
                          height: 4, 
                          borderRadius: 2,
                          backgroundColor: `${stat.color}20`,
                          '& .MuiLinearProgress-bar': { backgroundColor: stat.color }
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Paper sx={{ p: 2, mt: 3, bgcolor: "#E8F5E9" }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  🎯 Objectif du mois
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4">{stats.monthlyCompleted}/{stats.monthlyTarget}</Typography>
                    <Typography variant="caption">livraisons</Typography>
                  </Box>
                  <Typography variant="h5" color="success.main">
                    {Math.round((stats.monthlyCompleted / stats.monthlyTarget) * 100)}%
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

          </Grid>
        </Grid>
      </Grid>

      {/* Section inférieure */}
     

      {/* Info véhicule */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "#E3F2FD" }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          🛵 Information véhicule
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <DirectionsCar color="action" />
              <Typography variant="h6" fontWeight="bold">{driverInfo.vehicle}</Typography>
              <Typography variant="caption">Type</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">{driverInfo.licensePlate || "AB-123-CD"}</Typography>
              <Typography variant="caption">Plaque</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">{driverInfo.fuelLevel}%</Typography>
              <Typography variant="caption">Essence</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Schedule color="warning" />
              <Typography variant="h6" fontWeight="bold">{driverInfo.nextMaintenance}j</Typography>
              <Typography variant="caption">Entretien</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DriverDashboard;