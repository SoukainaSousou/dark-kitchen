import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
} from "@mui/material";

const dishes = [
    { id: 1, name: "Poulet Teriyaki", price: "14.90€" },
    { id: 2, name: "Burger Gourmet", price: "16.50€" },
];

const AdminMenu = () => {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Menu
            </Typography>

            <Button variant="contained" sx={{ mb: 3 }}>
                Ajouter un plat
            </Button>

            <Grid container spacing={3}>
                {dishes.map((dish) => (
                    <Grid item xs={12} md={4} key={dish.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{dish.name}</Typography>
                                <Typography color="primary.main" fontWeight="bold">
                                    {dish.price}
                                </Typography>

                                <Box mt={2}>
                                    <Button size="small">Modifier</Button>
                                    <Button size="small" color="error">
                                        Supprimer
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminMenu;
