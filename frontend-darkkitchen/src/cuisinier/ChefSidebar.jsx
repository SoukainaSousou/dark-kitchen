import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Avatar,
  Badge
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Icons pour cuisinier
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { authService } from "../services/api";

const ChefSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [preparingOrders, setPreparingOrders] = useState(0);
  
  const user = authService.getCurrentUser();
  const userName = user?.fullName || "Chef";

  // Fonction simple pour compter les commandes en préparation
  const updateOrderCount = () => {
    // Si vous avez un endpoint spécifique pour les commandes en préparation
    fetch('http://localhost:8080/api/orders/by-status/EN_PREPARATION')
      .then(response => response.json())
      .then(data => {
        setPreparingOrders(data.orders?.length || 0);
      })
      .catch(() => {
        // Valeur par défaut si l'API n'est pas disponible
        setPreparingOrders(0);
      });
  };

  // Mettre à jour le compteur quand l'utilisateur clique sur "Nouvelles"
  useEffect(() => {
    updateOrderCount();
  }, [location.pathname]); // Rafraîchir quand on change de page

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const menu = [
      { 
      label: "Dashboard", 
      path: "/chef", 
      icon: <DashboardIcon />,
      description: `Acceuil`
    },
    { 
      label: "Nouvelles", 
      path: "/chef/orders", 
      icon: <RestaurantIcon />,
      badge: preparingOrders,
      description: `À préparer (${preparingOrders})`
    },
    { 
      label: "Prêtes", 
      path: "/chef/ready", 
      icon: <CheckCircleIcon />,
      description: "À livrer"
    },
    { 
      label: "Mon Profil", 
      path: "/chef/profil", 
      icon: <PersonIcon />,
      description: "Mes informations"
    },
  ];

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
        Espace Cuisinier
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Profil */}
      {user && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3, 
          p: 2, 
          bgcolor: 'primary.light', 
          borderRadius: 2 
        }}>
          <Avatar 
            sx={{ 
              width: 50, 
              height: 50, 
              bgcolor: 'primary.main',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Chef Cuisinier
            </Typography>
          </Box>
        </Box>
      )}

      {/* Menu avec notifications */}
      <List sx={{ flexGrow: 1 }}>
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
                transition: "all 0.25s ease",
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                "&:hover": {
                  bgcolor: isActive ? "primary.dark" : "primary.light",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "primary.main",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={isActive ? 600 : 500}>
                      {item.label}
                    </Typography>
                    {item.badge > 0 && (
                      <Badge 
                        badgeContent={item.badge} 
                        color="error"
                        sx={{ 
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: 18,
                            minWidth: 18,
                            fontWeight: 'bold',
                          }
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={item.description}
                primaryTypographyProps={{
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
    </Box>
  );
};

export default ChefSidebar;