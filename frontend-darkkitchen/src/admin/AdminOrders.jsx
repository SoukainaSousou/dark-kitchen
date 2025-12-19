import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Grid,
  Avatar,
  Divider,
  Tooltip,
  Badge
} from "@mui/material";
import { useState } from "react";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";

const statusConfig = {
  "Nouvelle": {
    color: "warning",
    icon: <AccessTimeIcon fontSize="small" />,
    bgColor: "#FFF3E0"
  },
  "Préparation": {
    color: "primary",
    icon: <RestaurantIcon fontSize="small" />,
    bgColor: "#E3F2FD"
  },
  "Livraison": {
    color: "info",
    icon: <LocalShippingIcon fontSize="small" />,
    bgColor: "#E0F7FA"
  },
  "Livrée": {
    color: "success",
    icon: <CheckCircleIcon fontSize="small" />,
    bgColor: "#E8F5E9"
  },
  "Annulée": {
    color: "error",
    icon: <WarningIcon fontSize="small" />,
    bgColor: "#FFEBEE"
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    { 
      id: 1023, 
      client: "Karim Benali", 
      total: "29€", 
      status: "Préparation",
      date: "2024-01-15 14:30",
      items: [
        { name: "Burger Deluxe", quantity: 1, price: "15€" },
        { name: "Frites", quantity: 2, price: "7€" },
        { name: "Coca-Cola", quantity: 1, price: "3€" },
        { name: "Tiramisu", quantity: 1, price: "4€" }
      ],
      phone: "+33 6 12 34 56 78",
      address: "15 Rue de Paris, 75001",
      notes: "Sans oignons",
      deliveryTime: "30-45 min",
      payment: "Carte bancaire"
    },
    { 
      id: 1024, 
      client: "Sara Martin", 
      total: "18€", 
      status: "Livraison",
      date: "2024-01-15 15:15",
      items: [
        { name: "Salade César", quantity: 1, price: "12€" },
        { name: "Eau minérale", quantity: 1, price: "2€" },
        { name: "Café", quantity: 1, price: "4€" }
      ],
      phone: "+33 6 98 76 54 32",
      address: "8 Avenue des Champs, 75008",
      notes: "",
      deliveryTime: "20-30 min",
      payment: "Espèces"
    },
    { 
      id: 1025, 
      client: "Thomas Dubois", 
      total: "42€", 
      status: "Nouvelle",
      date: "2024-01-15 16:00",
      items: [
        { name: "Pizza Margherita", quantity: 1, price: "18€" },
        { name: "Pizza Pepperoni", quantity: 1, price: "20€" },
        { name: "Sprite", quantity: 2, price: "6€" }
      ],
      phone: "+33 7 23 45 67 89",
      address: "22 Rue du Commerce, 75002",
      notes: "Couper la pizza en 8 parts",
      deliveryTime: "45-60 min",
      payment: "Carte bancaire"
    },
    { 
      id: 1026, 
      client: "Marie Laurent", 
      total: "24€", 
      status: "Livrée",
      date: "2024-01-15 13:45",
      items: [
        { name: "Pasta Carbonara", quantity: 1, price: "16€" },
        { name: "Vin rouge", quantity: 1, price: "8€" }
      ],
      phone: "+33 6 87 65 43 21",
      address: "5 Boulevard Haussmann, 75009",
      notes: "",
      deliveryTime: "35-50 min",
      payment: "PayPal"
    },
    { 
      id: 1027, 
      client: "Jean Petit", 
      total: "15€", 
      status: "Annulée",
      date: "2024-01-15 12:30",
      items: [
        { name: "Sandwich Jambon", quantity: 1, price: "8€" },
        { name: "Chips", quantity: 1, price: "2€" },
        { name: "Jus d'orange", quantity: 1, price: "5€" }
      ],
      phone: "+33 6 34 56 78 90",
      address: "12 Rue de Rivoli, 75004",
      notes: "Client a annulé",
      deliveryTime: "25-40 min",
      payment: "Carte bancaire"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "Tous" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, status) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status, date: new Date().toLocaleString() } : o
      )
    );
  };

  const confirmDelete = () => {
    setOrders(orders.filter((o) => o.id !== deleteOrder.id));
    setDeleteOrder(null);
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const totalRevenue = orders
    .filter(order => order.status === "Livrée")
    .reduce((sum, order) => sum + parseFloat(order.total), 0);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestion des commandes
          </Typography>
          <Typography color="text.secondary">
            {orders.length} commandes • {totalRevenue}€ de revenus
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setStatusFilter("Tous")}
          >
            Filtres
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Exporter
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
          >
            Imprimer
          </Button>
        </Stack>
      </Box>

      {/* Status Overview */}
      <Grid container spacing={2} mb={4}>
        {Object.keys(statusConfig).map((status) => (
          <Grid item xs={6} sm={4} md={2.4} key={status}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: statusConfig[status].bgColor,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-2px)",
                  transition: "transform 0.2s"
                }
              }}
              onClick={() => setStatusFilter(status)}
            >
              <Badge badgeContent={getStatusCount(status)} color={statusConfig[status].color} sx={{ mb: 1 }}>
                <Box sx={{ color: `${statusConfig[status].color}.main` }}>
                  {statusConfig[status].icon}
                </Box>
              </Badge>
              <Typography variant="body2" fontWeight="medium">
                {status}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {getStatusCount(status)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher commande ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="Tous">Tous les statuts</MenuItem>
                {Object.keys(statusConfig).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status} ({getStatusCount(status)})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("Tous");
                }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell><Typography fontWeight="bold">N°</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Client</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Total</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Statut</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Livraison</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                hover
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  "&:last-child td": { border: 0 }
                }}
              >
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    #{order.id}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="medium">{order.client}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.phone}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">{order.date}</Typography>
                </TableCell>
                
                <TableCell>
                  <Typography fontWeight="bold" color="primary">
                    {order.total}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    sx={{
                      minWidth: 140,
                      bgcolor: statusConfig[order.status].bgColor,
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                    }}
                  >
                    {Object.keys(statusConfig).map((status) => (
                      <MenuItem key={status} value={status}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {statusConfig[status].icon}
                          {status}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                
                <TableCell>
                  <Chip
                    size="small"
                    icon={<AccessTimeIcon />}
                    label={order.deliveryTime}
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Voir détails">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Modifier">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => {/* Edit functionality */}}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Supprimer">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteOrder(order)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              Aucune commande trouvée
            </Typography>
          </Box>
        )}
      </Card>

      {/* View Dialog - Improved */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  Commande #{selectedOrder.id}
                </Typography>
                <Chip
                  icon={statusConfig[selectedOrder.status].icon}
                  label={selectedOrder.status}
                  color={statusConfig[selectedOrder.status].color}
                  sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent dividers sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Client Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Client
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography fontWeight="medium">{selectedOrder.client}</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{selectedOrder.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{selectedOrder.address}</Typography>
                    </Box>
                    {selectedOrder.notes && (
                      <Box display="flex" alignItems="flex-start" mt={2}>
                        <WarningIcon fontSize="small" sx={{ mr: 1, color: "warning.main", mt: 0.5 }} />
                        <Typography variant="body2" color="warning.main">
                          {selectedOrder.notes}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Order Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <ReceiptIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Information commande
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography>{selectedOrder.date}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Livraison
                        </Typography>
                        <Typography fontWeight="medium">{selectedOrder.deliveryTime}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Paiement
                        </Typography>
                        <Typography>{selectedOrder.payment}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {selectedOrder.total}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Items */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Articles commandés
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Article</TableCell>
                        <TableCell align="right">Quantité</TableCell>
                        <TableCell align="right">Prix unitaire</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.price}</TableCell>
                          <TableCell align="right">
                            {parseFloat(item.price) * item.quantity}€
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ borderTop: 2 }}>
                        <TableCell colSpan={3} align="right">
                          <Typography fontWeight="bold">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary">
                            {selectedOrder.total}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
              <Button
                startIcon={<EmailIcon />}
                onClick={() => {/* Email functionality */}}
              >
                Envoyer reçu
              </Button>
              <Button
                startIcon={<PrintIcon />}
                variant="outlined"
                onClick={() => window.print()}
              >
                Imprimer
              </Button>
              <Button
                variant="contained"
                onClick={() => setSelectedOrder(null)}
                sx={{ ml: 1 }}
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={Boolean(deleteOrder)}
        onClose={() => setDeleteOrder(null)}
      >
        <DialogTitle sx={{ color: "error.main" }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Supprimer commande
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la commande #{deleteOrder?.id} ?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Cette action est irréversible. Toutes les données associées seront perdues.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOrder(null)}>
            Annuler
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={confirmDelete}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders;