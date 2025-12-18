import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

const StatCard = ({ title, value }) => (
    <Card sx={{ height: "100%" }}>
        <CardContent>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    return (
        <>
            {/* Hero Admin */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    p: 4,
                    borderRadius: 3,
                    mb: 4,
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Tableau de bord
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                    Vue générale de votre dark kitchen
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <StatCard title="Commandes aujourd’hui" value="128" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Chiffre d'affaires" value="2 450 €" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="En préparation" value="12" />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Livraisons" value="7" />
                </Grid>
            </Grid>
        </>
    );
};

export default AdminDashboard;
