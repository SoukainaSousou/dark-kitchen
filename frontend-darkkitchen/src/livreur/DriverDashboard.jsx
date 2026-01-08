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
  IconButton,
  Alert,
  Button,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
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
  TrendingUp,
  LocationOn,
  Payment,
  NavigateNext,
  Person,
  Schedule,
  Receipt,
  Straighten
} from "@mui/icons-material";
import { useState, useEffect } from "react";

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
        <Box
          sx={{
            bgcolor: `${color}20`,
            p: 1.5,
            borderRadius: 2,
            color: color
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ActiveDelivery = () => {
  const delivery = {
    id: 1023,
    client: "Karim Benali",
    address: "12 Rue de Paris, 75001",
    items: ["Burger Deluxe x2", "Frites x2"],
    amount: "29.50€",
    timeRemaining: "12",
    distance: "2.4km",
    phone: "+33 6 12 34 56 78"
  };

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
              {delivery.amount}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {delivery.items.join(", ")}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2">{delivery.client}</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">{delivery.address}</Typography>
          </Box>
        </Paper>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, textAlign: 'center' }}>
              <AccessTime color="warning" />
              <Typography variant="h6" fontWeight="bold">
                {delivery.timeRemaining}min
              </Typography>
              <Typography variant="caption">Temps restant</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, textAlign: 'center' }}>
              <Straighten color="info" />
              <Typography variant="h6" fontWeight="bold">
                {delivery.distance}
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
          >
            Appeler
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
          >
            Livré
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const NextDeliveries = () => {
  const deliveries = [
    { id: 1024, client: "Sarah", address: "8 Av. Champs", time: "15min", amount: "18.00€" },
    { id: 1025, client: "Thomas", address: "22 Rue Commerce", time: "25min", amount: "24.50€" },
    { id: 1026, client: "Marie", address: "5 Bd Haussmann", time: "32min", amount: "32.00€" },
  ];

  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📋 Prochaines livraisons
        </Typography>
        
        <List>
          {deliveries.map((delivery, index) => (
            <div key={delivery.id}>
              <ListItem 
                sx={{ 
                  p: 2,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    {delivery.client.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold">#{delivery.id} • {delivery.client}</Typography>
                      <Typography fontWeight="bold" color="primary">
                        {delivery.amount}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {delivery.address}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">
                          {delivery.time}
                        </Typography>
                      </Box>
                    </>
                  }
                />
                
                <NavigateNext color="action" />
              </ListItem>
              {index < deliveries.length - 1 && <Divider />}
            </div>
          ))}
        </List>
        
        <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
          Voir toutes les livraisons
        </Button>
      </CardContent>
    </Card>
  );
};

const DriverPerformance = () => {
  const stats = [
    { label: "Ponctualité", value: 94, color: "#4CAF50", target: 95 },
    { label: "Satisfaction", value: 96, color: "#2196F3", target: 90 },
    { label: "Livraisons/jour", value: 22, color: "#FF9800", target: 20 },
    { label: "Pourboires", value: 18, color: "#9C27B0", target: 15 },
  ];

  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📈 Mes performances
        </Typography>
        
        <Grid container spacing={2} mt={2}>
          {stats.map((stat, index) => (
            <Grid item xs={6} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={stat.color}>
                  {stat.value}{stat.label === "Pourboires" ? "€" : (stat.label === "Satisfaction" || stat.label === "Ponctualité") ? "%" : ""}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stat.value / stat.target) * 100}
                  color="primary"
                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
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
              <Typography variant="h4">285/400</Typography>
              <Typography variant="caption">livraisons</Typography>
            </Box>
            <Typography variant="h5" color="success.main">
              71%
            </Typography>
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

const EarningsToday = () => {
  const earnings = [
    { type: "Livraisons", amount: 67.00 },
    { type: "Pourboires", amount: 18.50 },
    { type: "Bonus", amount: 10.00 },
  ];

  const total = earnings.reduce((sum, item) => sum + item.amount, 0);

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
          {earnings.map((earning, index) => (
            <Paper key={index} sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
              <Typography>{earning.type}</Typography>
              <Typography fontWeight="bold">{earning.amount.toFixed(2)}€</Typography>
            </Paper>
          ))}
        </Stack>
        
        <Button
          fullWidth
          variant="contained"
          color="warning"
          startIcon={<Receipt />}
          sx={{ mt: 3 }}
        >
          Voir mes relevés
        </Button>
      </CardContent>
    </Card>
  );
};

const DriverMapView = () => {
  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Map color="primary" />
          <Typography variant="h6" fontWeight="bold">
            🗺️ Carte des livraisons
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            height: 200, 
            bgcolor: "#E3F2FD", 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            mb: 2
          }}
        >
          <Box textAlign="center">
            <Map sx={{ fontSize: 60 }} />
            <Typography>Carte interactive</Typography>
            <Typography variant="caption">Intégration Google Maps</Typography>
          </Box>
        </Box>
        
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <LocationOn color="success" />
              <Typography variant="body2">Départ</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <LocalShipping color="warning" />
              <Typography variant="body2">En cours</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <CheckCircle color="primary" />
              <Typography variant="body2">Terminées</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<DirectionsCar />}
          sx={{ mt: 2 }}
        >
          Ouvrir la navigation
        </Button>
      </CardContent>
    </Card>
  );
};

const DriverDashboard = () => {
  const [online, setOnline] = useState(true);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚚 Tableau de bord livreur
          </Typography>
          <Typography color="text.secondary">
            Bonjour Yassine, prêt pour les livraisons du jour ?
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
          >
            {online ? "Fin de service" : "Commencer"}
          </Button>
        </Box>
      </Box>

      {/* Stats principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Livraisons aujourd'hui"
            value="12"
            icon={<LocalShipping />}
            color="#2196F3"
            subtitle="+2 vs hier"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Gains totaux"
            value="95.50"
            unit="€"
            icon={<MonetizationOn />}
            color="#4CAF50"
            subtitle="+18.50€ pourboires"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Distance"
            value="45"
            unit="km"
            icon={<Straighten />}
            color="#FF9800"
            subtitle="Moyenne 22km/h"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DriverStatCard
            title="Temps moyen"
            value="18"
            unit="min"
            icon={<Speed />}
            color="#9C27B0"
            subtitle="-3min vs hier"
          />
        </Grid>
      </Grid>

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

      {/* Section principale */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <ActiveDelivery />
        </Grid>
        
        <Grid item xs={12} lg={7}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <NextDeliveries />
            </Grid>
            <Grid item xs={12}>
              <DriverMapView />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Section inférieure */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <DriverPerformance />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <EarningsToday />
        </Grid>
      </Grid>

      {/* Info véhicule */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "#E3F2FD" }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          🛵 Information véhicule
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <DirectionsCar color="action" />
              <Typography variant="h6" fontWeight="bold">Scooter</Typography>
              <Typography variant="caption">Type</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">68%</Typography>
              <Typography variant="caption">Essence</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">1560km</Typography>
              <Typography variant="caption">Kilométrage</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Schedule color="warning" />
              <Typography variant="h6" fontWeight="bold">15j</Typography>
              <Typography variant="caption">Prochain entretien</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Conseils rapides */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: "#F5F5F5" }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          📱 Conseils du jour
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Appelez le client 5min avant arrivée pour gagner du temps<br/>
          2. Vérifiez l'adresse complète avant de partir<br/>
          3. Gardez l'appli GPS ouverte pour optimiser les trajets<br/>
          4. Demandez toujours confirmation de livraison
        </Typography>
      </Paper>
    </Box>
  );
};

export default DriverDashboard;