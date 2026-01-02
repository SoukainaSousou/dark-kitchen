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
  Badge
} from "@mui/material";
import {
  AccessTime,
  Restaurant,
  LocalFireDepartment,
  CheckCircle,
  Warning,
  Timer,
  Speed,
  TrendingUp,
  TrendingDown,
  Notifications,
  Kitchen,
  Inventory,
  Refresh
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const StatCard = ({ title, value, icon, color = "warning", change, unit = "" }) => (
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
          {change && (
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

const ChefOrdersList = () => {
  const orders = [
    { id: 1023, client: "Karim", items: ["Burger x2", "Frites"], time: 12, priority: "urgent", status: "en préparation" },
    { id: 1024, client: "Sarah", items: ["Salade César"], time: 8, priority: "normal", status: "en attente" },
    { id: 1025, client: "Thomas", items: ["Pizza x1", "Coca"], time: 18, priority: "urgent", status: "en préparation" },
    { id: 1026, client: "Marie", items: ["Pasta"], time: 5, priority: "normal", status: "prêt" },
    { id: 1027, client: "Jean", items: ["Sandwich", "Chips"], time: 6, priority: "normal", status: "en attente" },
  ];

  const getPriorityColor = (priority) => {
    return priority === "urgent" ? "error" : "default";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "en préparation": return "warning";
      case "prêt": return "success";
      default: return "default";
    }
  };

  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            🚨 Commandes en attente
          </Typography>
          <Badge badgeContent={3} color="error">
            <LocalFireDepartment color="error" />
          </Badge>
        </Box>
        
        <Box>
          {orders.map((order) => (
            <Paper
              key={order.id}
              sx={{
                p: 2,
                mb: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: order.priority === "urgent" ? "#FFEBEE" : "transparent",
                borderLeft: order.priority === "urgent" ? "4px solid #F44336" : "none"
              }}
            >
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography fontWeight="bold">#{order.id}</Typography>
                  <Chip
                    label={order.priority}
                    color={getPriorityColor(order.priority)}
                    size="small"
                  />
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {order.client} • {order.items.join(", ")}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography fontWeight="bold">{order.time}min</Typography>
                </Box>
                <Button size="small" variant="contained" color="warning">
                  Démarrer
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const ChefTimer = () => {
  const [timer, setTimer] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card sx={{ height: "100%", boxShadow: 2, bgcolor: "#FFF3E0" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⏱️ Timer actif
        </Typography>
        
        <Box textAlign="center" my={4}>
          <Typography variant="h1" fontWeight="bold" color="warning.dark">
            {formatTime(timer)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Commande #1023 - Burger Deluxe
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="warning" startIcon={<Timer />}>
            Pause
          </Button>
          <Button variant="outlined" color="success" startIcon={<CheckCircle />}>
            Terminé
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const KitchenPerformance = () => {
  const performanceData = [
    { label: "Préparation", value: 85, color: "#4CAF50" },
    { label: "Qualité", value: 92, color: "#2196F3" },
    { label: "Ponctualité", value: 78, color: "#FF9800" },
    { label: "Équipe", value: 88, color: "#9C27B0" },
  ];

  return (
    <Card sx={{ height: "100%", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📊 Performance cuisine
        </Typography>
        
        <Box mt={3}>
          {performanceData.map((item, index) => (
            <Box key={index} mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{item.label}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {item.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: `${item.color}20`,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        
        <Paper sx={{ p: 2, mt: 3, bgcolor: "#F5F5F5" }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Objectif du jour
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">25/30</Typography>
            <Typography variant="caption" color="text.secondary">
              plats préparés
            </Typography>
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

const StockAlert = () => {
  const lowStockItems = [
    { item: "Steak haché", remaining: "3kg", needed: "10kg", critical: true },
    { item: "Pain burger", remaining: "12", needed: "50", critical: true },
    { item: "Fromage", remaining: "2kg", needed: "5kg", critical: false },
    { item: "Salade", remaining: "1kg", needed: "3kg", critical: false },
  ];

  return (
    <Card sx={{ height: "100%", boxShadow: 2, border: "2px solid #FF9800" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Warning color="warning" />
          <Typography variant="h6" fontWeight="bold" color="warning.dark">
            ⚠️ Stock faible
          </Typography>
        </Box>
        
        <Box>
          {lowStockItems.map((stock, index) => (
            <Paper
              key={index}
              sx={{
                p: 1.5,
                mb: 1,
                bgcolor: stock.critical ? "#FFF3E0" : "transparent",
                borderLeft: stock.critical ? "4px solid #FF9800" : "none"
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight="medium">{stock.item}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Restant: {stock.remaining}
                  </Typography>
                </Box>
                <Chip
                  label={stock.critical ? "URGENT" : "Attention"}
                  color={stock.critical ? "error" : "warning"}
                  size="small"
                />
              </Box>
            </Paper>
          ))}
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          color="warning"
          startIcon={<Inventory />}
          sx={{ mt: 2 }}
        >
          Commander ingrédients
        </Button>
      </CardContent>
    </Card>
  );
};

const ChefDashboard = () => {
  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            👨‍🍳 Tableau de bord cuisine
          </Typography>
          <Typography color="text.secondary">
            Bonjour Ali, préparez-vous pour une journée productive !
          </Typography>
        </Box>
        
        <Button variant="outlined" startIcon={<Refresh />}>
          Actualiser
        </Button>
      </Box>

      {/* Stats principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes actives"
            value="8"
            change={12}
            icon={<Restaurant />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Temps moyen"
            value="18"
            unit="min"
            change={-5}
            icon={<Speed />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Urgentes"
            value="3"
            icon={<LocalFireDepartment />}
            color="#F44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Préparés"
            value="25"
            change={8}
            icon={<CheckCircle />}
            color="#2196F3"
          />
        </Grid>
      </Grid>

      {/* Alertes */}
      <Alert 
        severity="warning" 
        icon={<LocalFireDepartment />}
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            Voir détails
          </Button>
        }
      >
        3 commandes urgentes nécessitent votre attention immédiate !
      </Alert>

      {/* Section principale */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChefOrdersList />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ChefTimer />
            </Grid>
            <Grid item xs={12}>
              <StockAlert />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Section inférieure */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <KitchenPerformance />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Classement cuisine
              </Typography>
              
              <Stack spacing={2} mt={2}>
                {[
                  { name: "Ali", score: 98, role: "Chef", color: "#FFD700" },
                  { name: "Karim", score: 92, role: "Sous-chef", color: "#C0C0C0" },
                  { name: "Sarah", score: 87, role: "Commis", color: "#CD7F32" },
                ].map((chef, index) => (
                  <Paper key={index} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: chef.color, width: 40, height: 40 }}>
                      {chef.name.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight="bold">{chef.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chef.role}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h5" fontWeight="bold">
                        {chef.score}
                      </Typography>
                      <Typography variant="caption">points</Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Conseils rapides */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "#FFF3E0" }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          💡 Astuces du jour
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Préparez les burgers en lot de 4 pour gagner du temps<br/>
          2. Vérifiez le stock de steak à 17h pour éviter les ruptures<br/>
          3. Les salades doivent être préparées juste avant service<br/>
          4. Timer chaque plat pour garantir la ponctualité
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChefDashboard;