import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Badge,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const API_URL = "http://localhost:8080/api";

const menu = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { 
    label: "Commandes", 
    path: "/admin/orders", 
    icon: <ReceiptLongIcon />,
    hasNotifications: true // Indique que cet item peut avoir des notifications
  },
  { label: "Menu", path: "/admin/menu", icon: <MenuBookIcon /> },
  { label: "Catégories", path: "/admin/categories", icon: <CategoryIcon /> },
  { label: "Staff", path: "/admin/users", icon: <PeopleIcon /> },
  { label: "Clients", path: "/admin/clients", icon: <GroupIcon /> },
  { label: "Profil", path: "/admin/profil", icon: <PersonIcon /> },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);

  // Récupérer les nouvelles commandes (EN_ATTENTE)
  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/by-status/EN_ATTENTE`);
      const pendingOrders = response.data.orders || response.data || [];
      setPendingOrdersCount(pendingOrders.length);
      
      // Calculer les notifications non lues
      const storedLastCheck = localStorage.getItem('lastNotificationCheck');
      if (storedLastCheck) {
        const lastCheck = new Date(storedLastCheck);
        const newOrders = pendingOrders.filter(order => 
          new Date(order.orderDate || order.createdAt) > lastCheck
        );
        setUnreadNotifications(newOrders.length);
      } else {
        setUnreadNotifications(pendingOrders.length);
      }
    } catch (error) {
      console.error("Erreur récupération commandes en attente:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir périodiquement
  useEffect(() => {
    fetchPendingOrders();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchPendingOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Marquage des notifications comme lues
  const markNotificationsAsRead = () => {
    localStorage.setItem('lastNotificationCheck', new Date().toISOString());
    setUnreadNotifications(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem('lastNotificationCheck'); // Nettoyer le timestamp
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        px: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
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
        sx={{ mb: 3 }}
      >
        Admin Dashboard
      </Typography>

      <Divider sx={{ mb: 2 }} />

    

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          const hasNotifications = item.hasNotifications && pendingOrdersCount > 0;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={item.path === "/admin/orders" ? markNotificationsAsRead : undefined}
              sx={{
                mb: 1,
                borderRadius: 2,
                transition: "all 0.25s ease",
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                position: 'relative',

                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "primary.main",
                  minWidth: 36,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.label}
                    {hasNotifications && (
                      <Badge 
                        badgeContent={pendingOrdersCount} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: 18,
                            minWidth: 18,
                          }
                        }}
                      />
                    )}
                  </Box>
                }
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                }}
              />

              {/* Indicateur visuel pour nouvelles commandes */}
              {hasNotifications && unreadNotifications > 0 && !isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 12,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    animation: 'pulse 1.5s infinite'
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Logout */}
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Déconnexion
      </Button>

      {/* Style pour l'animation de pulsation */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminSidebar;