import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";

const menu = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Commandes", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { label: "Menu", path: "/admin/menu", icon: <MenuBookIcon /> },
  { label: "Catégories", path: "/admin/categories", icon: <CategoryIcon /> },
  { label: "Staff", path: "/admin/users", icon: <PeopleIcon /> },
  { label: "Clients", path: "/admin/clients", icon: <GroupIcon /> },
  { label: "Factures", path: "/admin/invoices", icon: <ReceiptLongIcon /> },
 
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ou user
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
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
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

export default AdminSidebar;
