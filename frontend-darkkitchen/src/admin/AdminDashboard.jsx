import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  LocalShipping,
  AttachMoney,
  ShoppingCart,
  AccessTime
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const StatCard = ({ title, value, change, icon, color = "primary" }) => (
  <Card sx={{ height: "100%", position: "relative", boxShadow: 1 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
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
                {change > 0 ? "+" : ""}{change}% vs hier
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            p: 1.5,
            borderRadius: 2,
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DailySalesChart = () => {
  const data = [
    { jour: "Lun", ventes: 420, commandes: 85 },
    { jour: "Mar", ventes: 580, commandes: 92 },
    { jour: "Mer", ventes: 510, commandes: 78 },
    { jour: "Jeu", ventes: 690, commandes: 105 },
    { jour: "Ven", ventes: 820, commandes: 128 },
    { jour: "Sam", ventes: 950, commandes: 142 },
    { jour: "Dim", ventes: 720, commandes: 98 },
  ];

  return (
    <Card sx={{ height: "100%", boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Performance quotidienne
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="jour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'ventes' ? `${value}€` : value,
                  name === 'ventes' ? 'Chiffre d\'affaires' : 'Commandes'
                ]}
              />
              <Bar 
                yAxisId="left"
                dataKey="ventes" 
                name="Chiffre d'affaires"
                fill="#1976d2" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                yAxisId="right"
                dataKey="commandes" 
                name="Commandes"
                fill="#4caf50" 
                radius={[4, 4, 0, 0]} 
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box display="flex" justifyContent="center" gap={4} mt={2}>
          <Box display="flex" alignItems="center">
            <Box width={12} height={12} bgcolor="#1976d2" borderRadius="50%" mr={1} />
            <Typography variant="body2">Chiffre d'affaires</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box width={12} height={12} bgcolor="#4caf50" borderRadius="50%" mr={1} />
            <Typography variant="body2">Nombre de commandes</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const OrderStatusSummary = () => {
  const statusData = [
    { label: "Nouvelles", value: 12, color: "#ff9800" },
    { label: "En préparation", value: 8, color: "#2196f3" },
    { label: "Prêtes", value: 15, color: "#4caf50" },
    { label: "En livraison", value: 5, color: "#9c27b0" },
  ];

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card sx={{ height: "100%", boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Commandes en cours
        </Typography>
        
        <Box mt={2}>
          {statusData.map((status, index) => (
            <Box key={index} mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{status.label}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {status.value} commandes
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(status.value / total) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: `${status.color}20`,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: status.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        
        <Box mt={3} p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total commandes
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {total}
              </Typography>
            </Box>
            <AccessTime sx={{ color: 'primary.main', fontSize: 40 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentActivity = () => {
  const activities = [
    { time: "12:30", order: "#0012", action: "Commande livrée", amount: "24.50€", status: "success" },
    { time: "12:15", order: "#0011", action: "En préparation", amount: "18.00€", status: "info" },
    { time: "11:45", order: "#0010", action: "Prête à livrer", amount: "14.50€", status: "warning" },
    { time: "11:30", order: "#0009", action: "Commande payée", amount: "22.00€", status: "success" },
    { time: "11:15", order: "#0008", action: "Nouvelle commande", amount: "8.50€", status: "primary" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "success": return "#4caf50";
      case "info": return "#2196f3";
      case "warning": return "#ff9800";
      case "primary": return "#1976d2";
      default: return "#757575";
    }
  };

  return (
    <Card sx={{ height: "100%", boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Activité récente
        </Typography>
        
        <Box>
          {activities.map((activity, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                py: 2,
                borderBottom: index < activities.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <Box 
                sx={{ 
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getStatusColor(activity.status),
                  mr: 2
                }}
              />
              
              <Box flex={1}>
                <Typography variant="body2" fontWeight="medium">
                  {activity.action}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Commande {activity.order} • {activity.time}
                </Typography>
              </Box>
              
              <Typography variant="body2" fontWeight="bold">
                {activity.amount}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  return (
    <Box>
      {/* En-tête simplifié */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography color="text.secondary">
          Vue d'ensemble de votre activité
        </Typography>
      </Box>

      {/* Stats principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes aujourd'hui"
            value="128"
            change={12}
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chiffre d'affaires"
            value="2 450 €"
            change={8}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En préparation"
            value="18"
            change={-3}
            icon={<Restaurant />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En livraison"
            value="7"
            change={15}
            icon={<LocalShipping />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Section principale */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DailySalesChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OrderStatusSummary />
            </Grid>
            <Grid item xs={12}>
              <RecentActivity />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;