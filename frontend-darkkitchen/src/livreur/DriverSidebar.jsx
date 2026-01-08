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

// Icons pour livreur
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MapIcon from "@mui/icons-material/Map";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import PaymentIcon from "@mui/icons-material/Payment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const DriverSidebar = ({ activeDeliveries = 3 }) => {
  const location = useLocation();

  const menu = [
    { 
      label: "Livraisons", 
      path: "/driver/deliveries", 
      icon: <AssignmentIcon />,
      badge: activeDeliveries
    },
    { 
      label: "Carte", 
      path: "/driver/map", 
      icon: <MapIcon />
    },
    { 
      label: "Contacts", 
      path: "/driver/contacts", 
      icon: <PhoneIcon />
    },
    { 
      label: "Paiements", 
      path: "/driver/payments", 
      icon: <PaymentIcon />
    },
    { 
      label: "Véhicule", 
      path: "/driver/vehicle", 
      icon: <DirectionsCarIcon />
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
        Driver Dashboard
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Profil livreur */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Avatar 
          sx={{ 
            width: 50, 
            height: 50, 
            bgcolor: 'primary.main'
          }}
        >
          <LocalShippingIcon />
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Yassine Ben
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Livreur • Scooter
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
                12
              </Typography>
              <Typography variant="caption">Livraisons</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="bold" color="primary">
                85.50€
              </Typography>
              <Typography variant="caption">Gains</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DriverSidebar;