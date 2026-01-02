import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  Avatar
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

// Icons pour cuisinier
import RestaurantIcon from "@mui/icons-material/Restaurant";
import KitchenIcon from "@mui/icons-material/Kitchen";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";

const ChefSidebar = ({ urgentOrders = 3 }) => {
  const location = useLocation();

  const menu = [
    { 
      label: "Commandes", 
      path: "/chef/orders", 
      icon: <RestaurantIcon />,
      badge: urgentOrders
    },
    { 
      label: "Préparation", 
      path: "/chef/preparation", 
      icon: <KitchenIcon />
    },
    { 
      label: "Timer", 
      path: "/chef/timer", 
      icon: <AccessTimeIcon />
    },
    { 
      label: "Stock", 
      path: "/chef/inventory", 
      icon: <InventoryIcon />
    },
    { 
      label: "Alertes", 
      path: "/chef/alerts", 
      icon: <WarningIcon />
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
      }}
    >
      {/* Logo - MÊME POUR TOUS */}
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary.main"
        sx={{
          mb: 2,
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
        Chef Dashboard
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Profil cuisinier */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Avatar 
          sx={{ 
            width: 50, 
            height: 50, 
            bgcolor: 'warning.main'
          }}
        >
          <RestaurantIcon />
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Ali Hassan
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cuisinier Chef
          </Typography>
        </Box>
      </Box>

      {/* Menu */}
      <List>
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
                bgcolor: isActive ? "warning.main" : "transparent",
                color: isActive ? "white" : "text.primary",

                "&:hover": {
                  bgcolor: isActive ? "warning.dark" : "warning.light",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "warning.main",
                  minWidth: 36,
                }}
              >
                {item.badge ? (
                  <Badge 
                    badgeContent={item.badge} 
                    color="error"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontSize: '0.6rem',
                      } 
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Stats en bas */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Performance du jour
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                25
              </Typography>
              <Typography variant="caption">Plats</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="bold" color="warning">
                18min
              </Typography>
              <Typography variant="caption">Moyenne</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChefSidebar;