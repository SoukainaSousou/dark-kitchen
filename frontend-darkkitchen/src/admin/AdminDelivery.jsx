import { Card, CardContent, Typography, Button } from "@mui/material";

const AdminDelivery = () => (
    <Card>
        <CardContent>
            <Typography variant="h6">Commande #1023</Typography>
            <Typography>📍 12 Rue de Paris</Typography>
            <Button variant="contained" color="success" sx={{ mt: 2 }}>
                Livrée
            </Button>
        </CardContent>
    </Card>
);

export default AdminDelivery;
