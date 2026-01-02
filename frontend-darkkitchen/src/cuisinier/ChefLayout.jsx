import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import ChefSidebar from "./ChefSidebar";

const ChefLayout = () => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
            <ChefSidebar />

            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "white", color: "text.primary" }}
                >
                    <Toolbar>
                        <Typography variant="h6" fontWeight="bold">
                            TasteLab • Cuisinier
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

export default ChefLayout;
