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
  Paper,
  Stack,
  Divider,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  TextField
} from "@mui/material";
import {
  LocalShipping,
  CheckCircle,
  AccessTime,
  LocationOn,
  Phone,
  Person,
  Warning,
  Directions,
  Map,
  Timer,
  DoneAll,
  Pending,
  Edit,
  Chat,
  Refresh,
  History
} from "@mui/icons-material";
import { useState, useEffect } from "react";

// Import des icônes manquantes
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const AdminDelivery = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1023,
      client: "Karim Benali",
      address: "12 Rue de Paris, 75001 Paris",
      phone: "+33 6 12 34 56 78",
      total: "29€",
      status: "en cours",
      deliveryPerson: "Mohamed",
      vehicle: "scooter",
      estimatedTime: "15 min",
      timeElapsed: 8,
      items: [
        "Poulet Teriyaki x2",
        "Riz cantonnais x1",
        "Soupe x1"
      ],
      notes: "Sonner 2 fois",
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
      id: 1024,
      client: "Sara Martin",
      address: "8 Avenue des Champs, 75008 Paris",
      phone: "+33 6 98 76 54 32",
      total: "18€",
      status: "en attente",
      deliveryPerson: "À assigner",
      vehicle: "vélo",
      estimatedTime: "25 min",
      timeElapsed: 0,
      items: [
        "Burger Deluxe x1",
        "Frites x2"
      ],
      notes: "Code porte: 1234B",
      coordinates: { lat: 48.8698, lng: 2.3074 }
    },
    {
      id: 1025,
      client: "Thomas Dubois",
      address: "22 Rue du Commerce, 75002 Paris",
      phone: "+33 7 23 45 67 89",
      total: "24€",
      status: "livrée",
      deliveryPerson: "Jean",
      vehicle: "voiture",
      estimatedTime: "0 min",
      timeElapsed: 32,
      items: [
        "Pizza Margherita x1",
        "Salade x1"
      ],
      notes: "",
      coordinates: { lat: 48.8674, lng: 2.3416 }
    },
    {
      id: 1026,
      client: "Marie Laurent",
      address: "5 Boulevard Haussmann, 75009 Paris",
      phone: "+33 6 87 65 43 21",
      total: "32€",
      status: "en retard",
      deliveryPerson: "Ahmed",
      vehicle: "scooter",
      estimatedTime: "+10 min",
      timeElapsed: 42,
      items: [
        "Pasta Carbonara x2",
        "Vin rouge x1"
      ],
      notes: "Appeler à l'arrivée",
      coordinates: { lat: 48.8721, lng: 2.3376 }
    }
  ]);

  const [deliveryPersons, setDeliveryPersons] = useState([
    { id: 1, name: "Mohamed", status: "en livraison", vehicle: "scooter", deliveries: 3 },
    { id: 2, name: "Jean", status: "disponible", vehicle: "voiture", deliveries: 5 },
    { id: 3, name: "Sarah", status: "disponible", vehicle: "vélo", deliveries: 2 },
    { id: 4, name: "Ahmed", status: "en livraison", vehicle: "scooter", deliveries: 4 }
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [autoAssign, setAutoAssign] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      // Mettre à jour les temps des livraisons en cours
      setDeliveries(prev => prev.map(delivery => 
        delivery.status === "en cours" || delivery.status === "en retard"
          ? { ...delivery, timeElapsed: delivery.timeElapsed + 1 }
          : delivery
      ));
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);

  const markAsDelivered = (id) => {
    setDeliveries(prev => prev.map(delivery =>
      delivery.id === id
        ? { ...delivery, status: "livrée", estimatedTime: "0 min" }
        : delivery
    ));
    
    // Libérer le livreur
    const delivery = deliveries.find(d => d.id === id);
    if (delivery && delivery.deliveryPerson !== "À assigner") {
      setDeliveryPersons(prev => prev.map(person =>
        person.name === delivery.deliveryPerson
          ? { ...person, status: "disponible", deliveries: person.deliveries + 1 }
          : person
      ));
    }
  };

  const assignDeliveryPerson = (deliveryId, personName) => {
    setDeliveries(prev => prev.map(delivery =>
      delivery.id === deliveryId
        ? { 
            ...delivery, 
            deliveryPerson: personName,
            status: "en cours"
          }
        : delivery
    ));
    
    // Mettre à jour le statut du livreur
    setDeliveryPersons(prev => prev.map(person =>
      person.name === personName
        ? { ...person, status: "en livraison" }
        : person
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "livrée": return "success";
      case "en cours": return "primary";
      case "en attente": return "warning";
      case "en retard": return "error";
      default: return "default";
    }
  };

  const getVehicleIcon = (vehicle) => {
    switch(vehicle) {
      case "scooter": return <TwoWheelerIcon />;
      case "voiture": return <DirectionsCarIcon />;
      case "vélo": return <DirectionsBikeIcon />;
      default: return <Directions />;
    }
  };

  const inProgressDeliveries = deliveries.filter(d => d.status === "en cours" || d.status === "en retard").length;
  const pendingDeliveries = deliveries.filter(d => d.status === "en attente").length;
  const deliveredToday = deliveries.filter(d => d.status === "livrée").length;
  const lateDeliveries = deliveries.filter(d => d.status === "en retard").length;

  const availableDeliveryPersons = deliveryPersons.filter(p => p.status === "disponible");

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚚 Gestion des livraisons
          </Typography>
          <Typography color="text.secondary">
            Suivi en temps réel de vos livreurs et commandes
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                color="primary"
              />
            }
            label="Assignation auto"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => setTimer(0)}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<History />}
            onClick={() => {/* Voir historique */}}
          >
            Historique
          </Button>
        </Stack>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
            <Badge badgeContent={lateDeliveries} color="error" sx={{ mb: 1 }}>
              <LocalShipping sx={{ color: 'primary.main', fontSize: 40 }} />
            </Badge>
            <Typography variant="h6" fontWeight="bold">
              {inProgressDeliveries}
            </Typography>
            <Typography variant="body2">En cours</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
            <Pending sx={{ color: 'warning.main', fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {pendingDeliveries}
            </Typography>
            <Typography variant="body2">En attente</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {deliveredToday}
            </Typography>
            <Typography variant="body2">Livrées aujourd'hui</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
            <Timer sx={{ color: 'info.main', fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {timer}min
            </Typography>
            <Typography variant="body2">Suivi actif</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertes */}
      {lateDeliveries > 0 && (
        <Alert 
          severity="error" 
          icon={<Warning />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              Voir les retards
            </Button>
          }
        >
          {lateDeliveries} livraison(s) en retard !
        </Alert>
      )}

      {/* Livreurs */}
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={2}>
        Équipe de livraison
      </Typography>
      <Grid container spacing={2} mb={4}>
        {deliveryPersons.map((person) => (
          <Grid item xs={12} sm={6} md={3} key={person.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: person.status === 'disponible' ? 'success.main' : 'primary.main' }}>
                    {person.name.charAt(0)}
                  </Avatar>
                  <Chip
                    label={person.status}
                    color={person.status === 'disponible' ? 'success' : 'primary'}
                    size="small"
                  />
                </Box>
                <Typography variant="h6">{person.name}</Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {getVehicleIcon(person.vehicle)}
                  <Typography variant="body2" color="text.secondary">
                    {person.vehicle}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {person.deliveries} livraisons aujourd'hui
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Livraisons en cours */}
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={2}>
        Livraisons actives
      </Typography>
      <Grid container spacing={3}>
        {deliveries.map((delivery) => (
          <Grid item xs={12} md={6} key={delivery.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: delivery.status === 'en retard' ? '2px solid' : '1px solid',
                borderColor: delivery.status === 'en retard' ? 'error.main' : 'divider'
              }}
            >
              <CardContent>
                {/* En-tête */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      #{delivery.id}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {delivery.client}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<AccessTime />}
                      label={`${delivery.timeElapsed}min`}
                      color={delivery.timeElapsed > 30 ? "error" : "default"}
                      size="small"
                    />
                    <Chip
                      label={delivery.status}
                      color={getStatusColor(delivery.status)}
                      size="small"
                    />
                  </Stack>
                </Box>

                {/* Informations */}
                <Box mb={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{delivery.address}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{delivery.phone}</Typography>
                  </Box>
                  {delivery.notes && (
                    <Alert severity="info" sx={{ mt: 1 }} icon={null}>
                      <Typography variant="caption">{delivery.notes}</Typography>
                    </Alert>
                  )}
                </Box>

                {/* Articles */}
                <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Articles:
                  </Typography>
                  {delivery.items.map((item, index) => (
                    <Typography key={index} variant="body2">
                      • {item}
                    </Typography>
                  ))}
                </Paper>

                {/* Livreur et actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Livreur assigné
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {delivery.deliveryPerson.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {delivery.deliveryPerson}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {getVehicleIcon(delivery.vehicle)}
                          <Typography variant="caption" color="text.secondary">
                            {delivery.vehicle} • {delivery.estimatedTime}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {delivery.status !== "livrée" && delivery.deliveryPerson === "À assigner" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        Assigner
                      </Button>
                    )}
                    
                    {delivery.status === "en cours" || delivery.status === "en retard" ? (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => markAsDelivered(delivery.id)}
                      >
                        Marquer livrée
                      </Button>
                    ) : delivery.status === "en attente" ? (
                      <Button
                        variant="outlined"
                        disabled
                      >
                        En attente de livreur
                      </Button>
                    ) : (
                      <Chip
                        icon={<CheckCircle />}
                        label="Livrée"
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

      {/* Carte simulée */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            <Map sx={{ mr: 1, verticalAlign: 'middle' }} />
            Vue carte des livraisons
          </Typography>
          <Button startIcon={<Directions />} variant="outlined">
            Ouvrir Google Maps
          </Button>
        </Box>
        <Box 
          sx={{ 
            height: 200, 
            bgcolor: 'primary.light', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography color="primary">
            🗺️ Carte interactive des livraisons en cours
          </Typography>
        </Box>
      </Paper>

      {/* Dialogue d'assignation */}
      <Dialog open={Boolean(selectedDelivery)} onClose={() => setSelectedDelivery(null)}>
        <DialogTitle>
          Assigner un livreur à la commande #{selectedDelivery?.id}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Client: {selectedDelivery?.client}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Adresse: {selectedDelivery?.address}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Livreurs disponibles:
          </Typography>
          
          <List>
            {availableDeliveryPersons.length > 0 ? (
              availableDeliveryPersons.map((person) => (
                <ListItem
                  key={person.id}
                  button
                  onClick={() => {
                    assignDeliveryPerson(selectedDelivery.id, person.name);
                    setSelectedDelivery(null);
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {person.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={person.name}
                    secondary={`${person.vehicle} • ${person.deliveries} livraisons aujourd'hui`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                Aucun livreur disponible. Attendez qu'un livreur se libère.
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDelivery(null)}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDelivery;