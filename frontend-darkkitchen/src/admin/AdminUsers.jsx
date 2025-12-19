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
  Select,
  MenuItem,
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
  Switch,
  FormControlLabel,
  Badge,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  FormControl, // AJOUTÉ ICI
  InputLabel // AJOUTÉ ICI si vous utilisez InputLabel
} from "@mui/material";
import { useState } from "react";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import WarningIcon from "@mui/icons-material/Warning";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const roles = [
  { value: "admin", label: "Administrateur", icon: <AdminPanelSettingsIcon />, color: "error" },
  { value: "cuisinier", label: "Cuisinier", icon: <RestaurantIcon />, color: "warning" },
  { value: "livreur", label: "Livreur", icon: <LocalShippingIcon />, color: "info" },
  { value: "manager", label: "Manager", icon: <PersonIcon />, color: "success" }
];

const statuses = [
  { value: "actif", label: "Actif", color: "success" },
  { value: "inactif", label: "Inactif", color: "default" },
  { value: "conges", label: "Congés", color: "warning" }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: "Mohamed Ali", 
      email: "mohamed@darkkitchen.com",
      phone: "+33 6 12 34 56 78",
      role: "admin", 
      status: "actif",
      joinedDate: "2023-01-15",
      lastLogin: "2024-01-15 14:30",
      isActive: true,
      permissions: ["dashboard", "menu", "orders", "users", "settings"],
      avatarColor: "#1976d2"
    },
    { 
      id: 2, 
      name: "Ali Hassan", 
      email: "ali@darkkitchen.com",
      phone: "+33 6 23 45 67 89",
      role: "cuisinier", 
      status: "actif",
      joinedDate: "2023-03-20",
      lastLogin: "2024-01-15 12:45",
      isActive: true,
      permissions: ["kitchen", "orders"],
      avatarColor: "#ff9800"
    },
    { 
      id: 3, 
      name: "Yassine Ben", 
      email: "yassine@darkkitchen.com",
      phone: "+33 6 34 56 78 90",
      role: "livreur", 
      status: "actif",
      joinedDate: "2023-05-10",
      lastLogin: "2024-01-15 15:20",
      isActive: true,
      permissions: ["delivery", "orders"],
      avatarColor: "#2196f3"
    },
    { 
      id: 4, 
      name: "Sarah Martin", 
      email: "sarah@darkkitchen.com",
      phone: "+33 6 45 67 89 01",
      role: "manager", 
      status: "actif",
      joinedDate: "2023-02-28",
      lastLogin: "2024-01-15 09:15",
      isActive: true,
      permissions: ["dashboard", "orders", "analytics"],
      avatarColor: "#4caf50"
    },
    { 
      id: 5, 
      name: "Thomas Dubois", 
      email: "thomas@darkkitchen.com",
      phone: "+33 6 56 78 90 12",
      role: "cuisinier", 
      status: "conges",
      joinedDate: "2023-07-15",
      lastLogin: "2024-01-10 18:30",
      isActive: false,
      permissions: ["kitchen"],
      avatarColor: "#9c27b0"
    }
  ]);

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({});
  const [newUser, setNewUser] = useState({ 
    name: "", 
    email: "",
    phone: "",
    role: "cuisinier", 
    status: "actif",
    isActive: true
  });
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showInactive, setShowInactive] = useState(false);

  // Ajouter utilisateur
  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    
    const userRole = roles.find(r => r.value === newUser.role);
    
    const newUserObj = {
      ...newUser,
      id: Date.now(),
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: "Jamais",
      permissions: getDefaultPermissions(newUser.role),
      avatarColor: getRandomColor(),
      isActive: newUser.status === "actif"
    };
    
    setUsers([...users, newUserObj]);
    setNewUser({ 
      name: "", 
      email: "",
      phone: "",
      role: "cuisinier", 
      status: "actif",
      isActive: true
    });
    setOpenDialog(false);
  };

  // Sauvegarder modification
  const handleSave = () => {
    setUsers(users.map(user => 
      user.id === editId 
        ? { 
            ...user, 
            ...editValue,
            isActive: editValue.status === "actif"
          } 
        : user
    ));
    setEditId(null);
  };

  // Supprimer utilisateur
  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== deleteId));
    setDeleteId(null);
  };

  // Activer/désactiver utilisateur
  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { 
            ...user, 
            isActive: !user.isActive,
            status: user.status === "actif" ? "inactif" : "actif"
          } 
        : user
    ));
  };

  // Obtenir les permissions par défaut
  const getDefaultPermissions = (role) => {
    switch(role) {
      case "admin":
        return ["dashboard", "menu", "orders", "kitchen", "delivery", "users", "analytics", "settings"];
      case "cuisinier":
        return ["kitchen", "orders"];
      case "livreur":
        return ["delivery", "orders"];
      case "manager":
        return ["dashboard", "orders", "analytics", "menu"];
      default:
        return ["orders"];
    }
  };

  // Fonction utilitaire
  const getRandomColor = () => {
    const colors = [
      "#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", 
      "#d32f2f", "#0288d1", "#7b1fa2", "#c2185b"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRoleIcon = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.icon : <PersonIcon />;
  };

  const getRoleColor = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.color : "default";
  };

  const getStatusColor = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.color : "default";
  };

  const filteredUsers = showInactive 
    ? users 
    : users.filter(user => user.status !== "inactif");

  const activeUsers = users.filter(user => user.isActive).length;
  const roleCounts = roles.reduce((acc, role) => {
    acc[role.value] = users.filter(user => user.role === role.value).length;
    return acc;
  }, {});

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            👥 Gestion des utilisateurs
          </Typography>
          <Typography color="text.secondary">
            Gérez les accès et rôles de votre équipe
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          size="large"
        >
          Nouvel utilisateur
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Utilisateurs actifs
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {activeUsers}/{users.length}
                </Typography>
              </Box>
              <PersonIcon sx={{ color: 'success.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Administrateurs
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.admin || 0}
                </Typography>
              </Box>
              <AdminPanelSettingsIcon sx={{ color: 'error.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cuisiniers
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.cuisinier || 0}
                </Typography>
              </Box>
              <RestaurantIcon sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Livreurs
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {roleCounts.livreur || 0}
                </Typography>
              </Box>
              <LocalShippingIcon sx={{ color: 'info.main', fontSize: 40 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
              }
              label="Afficher les utilisateurs inactifs"
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Tous les utilisateurs" />
              <Tab label="Administrateurs" />
              <Tab label="Cuisiniers" />
              <Tab label="Livreurs" />
              <Tab label="En congés" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Utilisateur</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Rôle</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Statut</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Contact</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Dernière connexion</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover
                  sx={{ opacity: user.isActive ? 1 : 0.7 }}
                >
                  {/* Informations utilisateur */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: user.avatarColor }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="bold">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Rôle */}
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={roles.find(r => r.value === user.role)?.label || user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  
                  {/* Statut */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                      <Tooltip title={user.isActive ? "Activer/Désactiver" : ""}>
                        <IconButton
                          size="small"
                          onClick={() => toggleUserStatus(user.id)}
                          color={user.isActive ? "success" : "default"}
                        >
                          {user.isActive ? <CheckCircleIcon /> : <PendingIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  
                  {/* Contact */}
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Dernière connexion */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {user.lastLogin}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <CalendarTodayIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                        Arrivé le {user.joinedDate}
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
                            setEditId(user.id);
                            setEditValue({ 
                              name: user.name, 
                              email: user.email,
                              phone: user.phone,
                              role: user.role, 
                              status: user.status 
                            });
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(user.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">
                Aucun utilisateur trouvé
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Édition en ligne */}
      {editId && (
        <Card sx={{ mt: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ✏️ Modification de l'utilisateur
              </Typography>
              <IconButton onClick={() => setEditId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  value={editValue.name}
                  onChange={(e) => setEditValue({...editValue, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editValue.email}
                  onChange={(e) => setEditValue({...editValue, email: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={editValue.phone}
                  onChange={(e) => setEditValue({...editValue, phone: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Rôle
                  </Typography>
                  <Select
                    value={editValue.role}
                    onChange={(e) => setEditValue({...editValue, role: e.target.value})}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {role.icon}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Statut
                  </Typography>
                  <Select
                    value={editValue.status}
                    onChange={(e) => setEditValue({...editValue, status: e.target.value})}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        <Chip label={status.label} size="small" color={status.color} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={() => setEditId(null)} variant="outlined">
                Annuler
              </Button>
              <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
                Sauvegarder
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogue pour nouvel utilisateur */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nouvel utilisateur
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Rôle
                </Typography>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {role.icon}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Statut
                </Typography>
                <Select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Chip label={status.label} size="small" color={status.color} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Un email d'invitation sera envoyé à l'utilisateur avec ses identifiants de connexion.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={!newUser.name.trim() || !newUser.email.trim()}
          >
            Créer l'utilisateur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Supprimer l'utilisateur
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{users.find(u => u.id === deleteId)?.name}</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette action est irréversible. L'utilisateur perdra immédiatement l'accès à toutes les fonctionnalités.
          </Typography>
          
          {users.find(u => u.id === deleteId)?.role === "admin" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Cet utilisateur est administrateur. Assurez-vous qu'il reste au moins un autre administrateur.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>
            Annuler
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Guide des rôles */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          📋 Guide des rôles et permissions
        </Typography>
        <Grid container spacing={2}>
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={3} key={role.value}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {role.icon}
                  <Typography fontWeight="bold">{role.label}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {getDefaultPermissions(role.value).length} permissions
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  {role.value === "admin" && "Accès complet à toutes les fonctionnalités"}
                  {role.value === "cuisinier" && "Gestion cuisine et préparation des commandes"}
                  {role.value === "livreur" && "Gestion des livraisons et suivi"}
                  {role.value === "manager" && "Tableau de bord et analytics"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminUsers;