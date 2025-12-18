import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

const menu = [
    { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { label: "Commandes", path: "/admin/orders", icon: <ReceiptLongIcon /> },
    { label: "Cuisine", path: "/admin/kitchen", icon: <RestaurantIcon /> },
    { label: "Livraisons", path: "/admin/delivery", icon: <LocalShippingIcon /> },
    { label: "Menu", path: "/admin/menu", icon: <MenuBookIcon /> },
    { label: "Catégories", path: "/admin/categories", icon: <CategoryIcon /> },
    { label: "Utilisateurs", path: "/admin/users", icon: <PeopleIcon /> },
    { label: "Paramètres", path: "/admin/settings", icon: <SettingsIcon /> },
];

const AdminSidebar = () => {
    const location = useLocation();

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
            {/* Logo */}
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
                Admin Dashboard
            </Typography>

            <Divider sx={{ mb: 2 }} />

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
                                transition: "all 0.25s ease",
                                bgcolor: isActive ? "primary.light" : "transparent",
                                color: isActive ? "white" : "text.primary",

                                "&:hover": {
                                    bgcolor: "primary.main",
                                    color: "white",
                                },

                                "&::before": {
                                    content: '""',
                                    width: 4,
                                    height: "60%",
                                    bgcolor: "primary.main",
                                    borderRadius: 4,
                                    position: "absolute",
                                    left: 0,
                                    opacity: isActive ? 1 : 0,
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
        </Box>
    );
};

export default AdminSidebar;
