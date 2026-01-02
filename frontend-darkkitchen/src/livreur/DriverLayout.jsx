import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import DriverSidebar from "./DriverSidebar";

const DriverLayout = () => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
            <DriverSidebar/>

            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "white", color: "text.primary" }}
                >
                    <Toolbar>
                        <Typography variant="h6" fontWeight="bold">
                            TasteLab • Livreur
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 4 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DriverLayout;
