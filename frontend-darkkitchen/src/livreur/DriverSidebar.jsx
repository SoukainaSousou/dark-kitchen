import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  Avatar,
  Chip,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Alert
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Icons pour livreur
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { authService } from "../services/api";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const DriverSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Récupérer l'utilisateur connecté
  const user = authService?.getCurrentUser?.();
  const userName = user?.fullName || "Livreur";

  // Charger les commandes prêtes
  useEffect(() => {
    fetchReadyOrders();
    // Polling toutes les 30 secondes pour nouvelles commandes
    const interval = setInterval(fetchReadyOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReadyOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/delivery/ready`);
      setReadyOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Erreur chargement commandes prêtes:", error);
      // Données de démo en cas d'erreur
      setReadyOrders([
        { id: 1, orderNumber: "#0015", address: "123 Rue Principale", amount: 24.50 },
        { id: 2, orderNumber: "#0016", address: "456 Avenue Centrale", amount: 18.00 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de gestion des notifications
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/update-status`, {
        status: "EN_LIVRAISON",
        updatedBy: "driver"
      });
      
      // Rafraîchir la liste
      fetchReadyOrders();
      handleNotificationClose();
      
      // Naviguer vers les commandes actives
      navigate("/driver/orders");
    } catch (error) {
      console.error("Erreur acceptation commande:", error);
    }
  };

  const handleLogout = () => {
    authService?.logout?.();
    navigate('/');
  };

  // Menu simplifié pour livreur
  const menu = [
    { 
      label: "Dashboard", 
      path: "/driver", 
      icon: <DashboardIcon />,
      description: "Accueil"
    },
    { 
      label: "À Livrer", 
      path: "/driver/orders", 
      icon: <AssignmentIcon />,
      badge: readyOrders.length,
      description: "Commandes en attente"
    },
    { 
      label: "En Livraison", 
      path: "/driver/traking", 
      icon: <LocalShippingIcon />,
      description: "En cours de livraison"
    },
    { 
      label: "Mon Profil", 
      path: "/driver/profil", 
      icon: <PersonIcon />
    },
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* En-tête */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          sx={{
            mb: 1,
            fontFamily: '"Pacifico", cursive',
            textAlign: "center",
          }}
        >
          TasteLab
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Espace Livreur
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Barre supérieure avec notifications */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {/* Profil livreur */}
          {user && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              flex: 1,
              p: 1.5, 
              bgcolor: 'primary.light', 
              borderRadius: 2 
            }}>
              <Avatar 
                sx={{ 
                  width: 45, 
                  height: 45, 
                  bgcolor: 'primary.main',
                  fontSize: '1.2rem'
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.role === 'DRIVER' ? 'Livreur' : user.role || 'Utilisateur'}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Bouton notifications */}
          <Tooltip title="Nouvelles commandes">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                bgcolor: readyOrders.length > 0 ? 'warning.light' : 'grey.100',
                '&:hover': {
                  bgcolor: readyOrders.length > 0 ? 'warning.main' : 'grey.200',
                  color: readyOrders.length > 0 ? 'white' : 'inherit'
                }
              }}
            >
              <Badge 
                badgeContent={readyOrders.length} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.6rem',
                    height: 20,
                    minWidth: 20,
                    top: -5,
                    right: -5
                  } 
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

       
      </Box>

      {/* Menu principal */}
      <Box sx={{ flex: 1, px: 2, overflowY: 'auto' }}>
        <List sx={{ py: 1 }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  border: isActive ? 'none' : '1px solid',
                  borderColor: 'divider',
                  "&:hover": {
                    bgcolor: isActive ? "primary.dark" : "primary.light",
                    transform: isActive ? 'none' : 'translateX(4px)',
                    transition: 'all 0.2s ease'
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "primary.main",
                    minWidth: 40,
                  }}
                >
                  {item.badge && item.badge > 0 ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          fontSize: '0.6rem',
                          height: 20,
                          minWidth: 20,
                        } 
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.95rem',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: isActive ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

       

    
      </Box>

      {/* Section inférieure avec déconnexion */}
      <Box sx={{ 
        px: 2, 
        py: 3, 
        mt: 'auto',
        bgcolor: 'white',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            transition: 'all 0.2s ease'
          }}
        >
          DÉCONNEXION
        </Button>
      </Box>

      {/* Style pour l'animation de pulsation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default DriverSidebar;