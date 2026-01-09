// src/pages/AdminClients.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [hardDeleteId, setHardDeleteId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, totalOrders: 0, totalSpent: 0 });
  const [clientStats, setClientStats] = useState({}); // Pour stocker les stats par client

  // Récupérer les clients depuis l'API
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Récupérer les clients
      const clientsResponse = await fetch('http://localhost:8080/api/clients');
      
      if (!clientsResponse.ok) {
        throw new Error('Erreur lors de la récupération des clients');
      }
      
      const clientsData = await clientsResponse.json();
      setClients(clientsData);

      // Récupérer les statistiques globales
      const statsResponse = await fetch('http://localhost:8080/api/clients/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Récupérer les statistiques par client (nombre de commandes)
      const statsPromises = clientsData.map(async (client) => {
        try {
          const clientStatsResponse = await fetch(`http://localhost:8080/api/clients/${client.id}/stats`);
          if (clientStatsResponse.ok) {
            const clientStatsData = await clientStatsResponse.json();
            return { clientId: client.id, stats: clientStatsData };
          }
        } catch (error) {
          console.error(`Erreur stats client ${client.id}:`, error);
        }
        return { clientId: client.id, stats: { orderCount: 0, totalSpent: 0 } };
      });
      
      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(result => {
        statsMap[result.clientId] = result.stats;
      });
      setClientStats(statsMap);
      
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des clients',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Mettre à jour un client
  const handleUpdateClient = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }

      const updatedClient = await response.json();
      setClients(clients.map(client => client.id === editId ? updatedClient : client));
      setEditId(null);
      setSnackbar({
        open: true,
        message: 'Client modifié avec succès',
        severity: 'success'
      });
      fetchClients(); // Recharger pour mettre à jour les stats
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Bloquer/Débloquer un client (soft delete)
  const handleToggleActive = async (clientId, currentStatus) => {
    try {
      const endpoint = currentStatus 
        ? `http://localhost:8080/api/clients/${clientId}`
        : `http://localhost:8080/api/clients/${clientId}/activate`;
      
      const method = currentStatus ? 'DELETE' : 'POST';
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la ${currentStatus ? 'désactivation' : 'réactivation'}`);
      }

      await fetchClients(); // Recharger la liste
      setSnackbar({
        open: true,
        message: `Client ${currentStatus ? 'bloqué' : 'débloqué'} avec succès`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Supprimer définitivement un client (hard delete)
  const handleHardDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/${hardDeleteId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        // Si l'endpoint permanent n'existe pas, utiliser l'endpoint normal
        const deleteResponse = await fetch(`http://localhost:8080/api/clients/${hardDeleteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!deleteResponse.ok) {
          throw new Error('Erreur lors de la suppression');
        }
      }

      setClients(clients.filter(client => client.id !== hardDeleteId));
      setHardDeleteId(null);
      fetchClients(); // Recharger les stats
      setSnackbar({
        open: true,
        message: 'Client supprimé définitivement avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

 
  // Filtrer les clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      (client.firstName?.toLowerCase() + ' ' + client.lastName?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumber?.includes(searchTerm);
    
    if (activeTab === 0) return matchesSearch; // Tous
    if (activeTab === 1) return matchesSearch && client.active; // Actifs
    if (activeTab === 2) return matchesSearch && !client.active; // Inactifs
    return matchesSearch;
  });

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  };

  // Récupérer les statistiques d'un client
  const getClientStatsData = (clientId) => {
    return clientStats[clientId] || { orderCount: 0, totalSpent: 0 };
  };

  const getAvatarColor = (name) => {
    const colors = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f", "#0288d1"];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Calculer le nombre total de commandes et montant total
  const calculateTotals = () => {
    let totalOrders = 0;
    let totalSpent = 0;
    
    Object.values(clientStats).forEach(stat => {
      totalOrders += stat.orderCount || 0;
      totalSpent += stat.totalSpent || 0;
    });
    
    return { totalOrders, totalSpent };
  };

  const { totalOrders, totalSpent } = calculateTotals();

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
            👥 Gestion des Clients
          </Typography>
          <Typography color="text.secondary">
            Gérez les clients de votre restaurant
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchClients}
        >
          Actualiser
        </Button>
      </Box>

      {/* Statistiques améliorées */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Clients
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.total || clients.length}
                </Typography>
              </Box>
              <PersonIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Actifs
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {stats.active || clients.filter(c => c.active).length}
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Commandes Total
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalOrders}
                </Typography>
              </Box>
              <ShoppingCartIcon sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Chiffre d'affaires
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatPrice(totalSpent)}
                </Typography>
              </Box>
              <LoyaltyIcon sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Tous" />
                <Tab label="Actifs" />
                <Tab label="Inactifs" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des clients amélioré */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Client</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Statut</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Commandes</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Montant total</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Inscription</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Aucun client trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => {
                  const clientStat = getClientStatsData(client.id);
                  const orderCount = clientStat.orderCount || 0;
                  const totalSpent = clientStat.totalSpent || 0;
                  
                  return (
                    <TableRow key={client.id} hover>
                      {/* Informations client */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: getAvatarColor(client.firstName) }}>
                            {client.firstName?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">
                              {client.firstName} {client.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" hidden>
                              ID: {client.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      {/* Contact */}
                      <TableCell>
                        <Box>
                          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {client.email}
                            </Typography>
                          </Box>
                          {client.phoneNumber && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {client.phoneNumber || 'Non renseigné'}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      
                      {/* Statut */}
                      <TableCell>
                        {client.active ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Actif"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            icon={<BlockIcon />}
                            label="Inactif"
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      
                      {/* Commandes */}
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {orderCount}
                          </Typography>
                          {orderCount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              Dernière: {formatDate(clientStat.lastOrderDate)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      {/* Montant total */}
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          {formatPrice(totalSpent)}
                        </Typography>
                        {orderCount > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Moy: {formatPrice(totalSpent / orderCount)}
                          </Typography>
                        )}
                      </TableCell>
                      
                      {/* Date d'inscription */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarTodayIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDate(client.registrationDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setEditId(client.id);
                                setEditData({
                                  firstName: client.firstName,
                                  lastName: client.lastName,
                                  email: client.email,
                                  phoneNumber: client.phoneNumber || '',
                                  address: client.address || '',
                                  city: client.city || '',
                                  postalCode: client.postalCode || '',
                                  active: client.active
                                });
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={client.active ? "Bloquer" : "Débloquer"}>
                            <IconButton
                              size="small"
                              color={client.active ? "error" : "success"}
                              onClick={() => handleToggleActive(client.id, client.active)}
                            >
                              {client.active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => {
                                setSelectedClient({
                                  ...client,
                                  ...clientStat
                                });
                                setOpenDetails(true);
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue de modification */}
      {editId && (
        <Card sx={{ mt: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ✏️ Modification du client
              </Typography>
              <IconButton onClick={() => setEditId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  value={editData.firstName || ''}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  value={editData.lastName || ''}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={editData.phoneNumber || ''}
                  onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.active || false}
                      onChange={(e) => setEditData({...editData, active: e.target.checked})}
                      color="primary"
                    />
                  }
                  label="Compte actif"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={editData.address || ''}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={editData.city || ''}
                  onChange={(e) => setEditData({...editData, city: e.target.value})}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Code postal"
                  value={editData.postalCode || ''}
                  onChange={(e) => setEditData({...editData, postalCode: e.target.value})}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={() => setEditId(null)} variant="outlined">
                Annuler
              </Button>
              <Button onClick={handleUpdateClient} variant="contained" startIcon={<SaveIcon />}>
                Sauvegarder
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de suppression définitive */}
      <Dialog
        open={hardDeleteId !== null}
        onClose={() => setHardDeleteId(null)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Suppression définitive
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Êtes-vous sûr de vouloir supprimer définitivement ce client ?
          </Typography>
          
          {hardDeleteId && (() => {
            const client = clients.find(c => c.id === hardDeleteId);
            const clientStat = getClientStatsData(hardDeleteId);
            const orderCount = clientStat.orderCount || 0;
            
            return (
              <>
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  <Typography fontWeight="bold">
                    ATTENTION : Cette action est irréversible !
                  </Typography>
                </Alert>
                
                {orderCount > 0 ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography>
                      ⚠️ Ce client a {orderCount} commande(s). 
                      Vous devez d'abord supprimer ses commandes ou le bloquer temporairement.
                    </Typography>
                  </Alert>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Toutes les informations de ce client seront définitivement effacées.
                  </Typography>
                )}
              </>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHardDeleteId(null)}>
            Annuler
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleHardDelete}
            startIcon={<DeleteIcon />}
            disabled={hardDeleteId && getClientStatsData(hardDeleteId).orderCount > 0}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de détails client amélioré */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        {selectedClient && (() => {
          const clientStat = getClientStatsData(selectedClient.id);
          const orderCount = clientStat.orderCount || 0;
          const totalSpent = clientStat.totalSpent || 0;
          
          return (
            <>
              <DialogTitle>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Détails du client
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={3}>
                      <Avatar sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: getAvatarColor(selectedClient.firstName),
                        fontSize: '2rem'
                      }}>
                        {selectedClient.firstName?.charAt(0)}{selectedClient.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {selectedClient.firstName} {selectedClient.lastName}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip
                            label={selectedClient.active ? "ACTIF" : "INACTIF"}
                            color={selectedClient.active ? "success" : "error"}
                          />
                          <Chip
                            label={`${orderCount} commande(s)`}
                            color="info"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                      Contact
                    </Typography>
                    <Typography paragraph>
                      <strong>Email:</strong> {selectedClient.email}
                    </Typography>
                    <Typography paragraph>
                      <strong>Téléphone:</strong> {selectedClient.phoneNumber || 'Non renseigné'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 'small' }} />
                      Adresse
                    </Typography>
                    <Typography paragraph>
                      <strong>Adresse:</strong> {selectedClient.address || 'Non renseignée'}
                    </Typography>
                    <Typography paragraph>
                      <strong>Ville:</strong> {selectedClient.city || 'Non renseignée'}
                    </Typography>
                    <Typography paragraph>
                      <strong>Code postal:</strong> {selectedClient.postalCode || 'Non renseigné'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  
                  {/* Statistiques détaillées */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <ShoppingCartIcon sx={{ mr: 1, fontSize: 'small' }} />
                      Statistiques d'achat
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {orderCount}
                          </Typography>
                          <Typography variant="caption">
                            Commandes
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6" color="success.main">
                            {formatPrice(totalSpent)}
                          </Typography>
                          <Typography variant="caption">
                            Montant total
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6" color="warning.main">
                            {orderCount > 0 ? formatPrice(totalSpent / orderCount) : formatPrice(0)}
                          </Typography>
                          <Typography variant="caption">
                            Panier moyen
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6">
                            {formatDate(selectedClient.registrationDate)}
                          </Typography>
                          <Typography variant="caption">
                            Inscrit le
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {!selectedClient.active && (
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        Ce client a été bloqué. Il ne peut plus passer de commandes.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDetails(false)}>
                  Fermer
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setOpenDetails(false);
                    setEditId(selectedClient.id);
                    setEditData({
                      firstName: selectedClient.firstName,
                      lastName: selectedClient.lastName,
                      email: selectedClient.email,
                      phoneNumber: selectedClient.phoneNumber || '',
                      address: selectedClient.address || '',
                      city: selectedClient.city || '',
                      postalCode: selectedClient.postalCode || '',
                      active: selectedClient.active
                    });
                  }}
                >
                  Modifier
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminClients;