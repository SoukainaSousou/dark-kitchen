import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
  Paper,
  Stack,
  Divider,
  Alert
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Restaurant,
  LocalShipping,
  Timer,
  Warning,
  DoneAll,
  Refresh,
  Notifications
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const AdminKitchen = () => {
  const [orders, setOrders] = useState([
    {
      id: 1023,
      client: "Karim Benali",
      items: [
        { name: "Poulet Teriyaki", quantity: 2, status: "en préparation", time: 12 },
        { name: "Riz cantonnais", quantity: 1, status: "prêt", time: 8 },
        { name: "Soupe", quantity: 1, status: "en attente", time: 0 }
      ],
      total: "29€",
      status: "en préparation",
      timeElapsed: 15, // minutes
      priority: "normal",
      notes: "Sans oignons"
    },
    {
      id: 1024,
      client: "Sara Martin",
      items: [
        { name: "Burger Deluxe", quantity: 1, status: "en préparation", time: 10 },
        { name: "Frites", quantity: 2, status: "en préparation", time: 6 }
      ],
      total: "18€",
      status: "en préparation",
      timeElapsed: 8,
      priority: "urgent",
      notes: "À emporter"
    },
    {
      id: 1025,
      client: "Thomas Dubois",
      items: [
        { name: "Pizza Margherita", quantity: 1, status: "prêt", time: 18 },
        { name: "Salade", quantity: 1, status: "prêt", time: 5 }
      ],
      total: "24€",
      status: "prêt",
      timeElapsed: 25,
      priority: "normal",
      notes: ""
    }
  ]);

  const [preparationTime, setPreparationTime] = useState(0);
  const [urgentOrders, setUrgentOrders] = useState(0);

  // Simuler le temps de préparation
  useEffect(() => {
    const interval = setInterval(() => {
      setPreparationTime(prev => prev + 1);
      setOrders(prev => prev.map(order => ({
        ...order,
        timeElapsed: order.status === "en préparation" ? order.timeElapsed + 1 : order.timeElapsed
      })));
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const urgent = orders.filter(order => order.priority === "urgent" && order.status === "en préparation").length;
    setUrgentOrders(urgent);
  }, [orders]);

  const markItemAsReady = (orderId, itemName) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? {
            ...order,
            items: order.items.map(item =>
              item.name === itemName
                ? { ...item, status: "prêt" }
                : item
            ),
            status: order.items.every(item => item.status === "prêt") ? "prêt" : "en préparation"
          }
        : order
    ));
  };

  const markOrderAsReady = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? {
            ...order,
            items: order.items.map(item => ({ ...item, status: "prêt" })),
            status: "prêt"
          }
        : order
    ));
  };

  const startNewOrder = () => {
    const newOrder = {
      id: Math.floor(Math.random() * 9000) + 1000,
      client: "Nouveau Client",
      items: [
        { name: "Commande standard", quantity: 1, status: "en attente", time: 0 }
      ],
      total: "15€",
      status: "en attente",
      timeElapsed: 0,
      priority: "normal",
      notes: ""
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "prêt": return "success";
      case "en préparation": return "warning";
      case "en attente": return "default";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "error";
      case "normal": return "primary";
      default: return "default";
    }
  };

  const preparingOrders = orders.filter(order => order.status === "en préparation").length;
  const readyOrders = orders.filter(order => order.status === "prêt").length;

  return (
    <Box>
      {/* Header avec stats */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🍳 Tableau de bord cuisine
          </Typography>
          <Typography color="text.secondary">
            Gestion en temps réel des préparations
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => setPreparationTime(0)}
          >
            Réinitialiser timer
          </Button>
          <Button
            variant="contained"
            startIcon={<Restaurant />}
            onClick={startNewOrder}
          >
            Nouvelle commande
          </Button>
        </Stack>
      </Box>

      {/* Stats rapides */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
            <Typography variant="h6" fontWeight="bold" color="warning.dark">
              {preparingOrders}
            </Typography>
            <Typography variant="body2">En préparation</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
            <Typography variant="h6" fontWeight="bold" color="success.dark">
              {readyOrders}
            </Typography>
            <Typography variant="body2">Prêtes</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
            <Typography variant="h6" fontWeight="bold" color="error.dark">
              {urgentOrders}
            </Typography>
            <Typography variant="body2">Urgentes</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
            <Typography variant="h6" fontWeight="bold" color="info.dark">
              {preparationTime}min
            </Typography>
            <Typography variant="body2">Temps écoulé</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertes urgentes */}
      {urgentOrders > 0 && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              Voir les urgences
            </Button>
          }
        >
          {urgentOrders} commande(s) urgente(s) en attente !
        </Alert>
      )}

      {/* Liste des commandes */}
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: order.priority === 'urgent' ? '2px solid' : '1px solid',
                borderColor: order.priority === 'urgent' ? 'error.main' : 'divider',
                bgcolor: order.priority === 'urgent' ? 'error.light' : 'background.paper'
              }}
            >
              <CardContent>
                {/* En-tête de commande */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.client}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1}>
                    <Chip
                      size="small"
                      icon={<AccessTime />}
                      label={`${order.timeElapsed}min`}
                      color={order.timeElapsed > 20 ? "error" : "default"}
                    />
                    <Chip
                      size="small"
                      label={order.priority}
                      color={getPriorityColor(order.priority)}
                    />
                  </Stack>
                </Box>

                {/* Notes */}
                {order.notes && (
                  <Alert severity="info" sx={{ mb: 2 }} icon={null}>
                    <Typography variant="caption">{order.notes}</Typography>
                  </Alert>
                )}

                {/* Liste des articles */}
                <Box mb={2}>
                  {order.items.map((item, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: item.status === 'prêt' ? 'success.light' : 'grey.50'
                      }}
                    >
                      <Box>
                        <Typography fontWeight="medium">
                          {item.name} ×{item.quantity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Temps estimé: {item.time}min
                        </Typography>
                      </Box>
                      
                      {item.status !== 'prêt' ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => markItemAsReady(order.id, item.name)}
                          disabled={item.status === 'en attente'}
                        >
                          {item.status === 'en préparation' ? 'Marquer prêt' : 'Démarrer'}
                        </Button>
                      ) : (
                        <Chip
                          size="small"
                          icon={<CheckCircle />}
                          label="Prêt"
                          color="success"
                        />
                      )}
                    </Paper>
                  ))}
                </Box>

                {/* Progression */}
                <Box mb={2}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Progression: {order.items.filter(i => i.status === 'prêt').length}/{order.items.length} articles
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(order.items.filter(i => i.status === 'prêt').length / order.items.length) * 100}
                    color={order.status === 'prêt' ? 'success' : 'warning'}
                  />
                </Box>

                {/* Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    {order.total}
                  </Typography>
                  
                  <Stack direction="row" spacing={1}>
                    {order.status !== 'prêt' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => markOrderAsReady(order.id)}
                        disabled={!order.items.every(item => item.status === 'prêt')}
                        startIcon={<DoneAll />}
                      >
                        Tout prêt
                      </Button>
                    )}
                    
                    {order.status === 'prêt' && (
                      <Chip
                        icon={<LocalShipping />}
                        label="À livrer"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Aide rapide */}
      <Paper sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          💡 Guide rapide
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Cliquez sur "Marquer prêt" pour chaque article préparé<br/>
          • Utilisez "Tout prêt" quand tous les articles sont prêts<br/>
          • Les commandes urgentes sont en rouge avec timer accéléré<br/>
          • Vérifiez les notes spéciales des clients
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminKitchen;