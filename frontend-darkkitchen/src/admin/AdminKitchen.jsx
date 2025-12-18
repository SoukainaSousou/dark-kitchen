import { Card, CardContent, Typography, Button } from "@mui/material";

const AdminKitchen = () => (
    <Card>
        <CardContent>
            <Typography variant="h6">Commande #1023</Typography>
            <Typography>Poulet Teriyaki x2</Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
                Marquer comme prêt
            </Button>
        </CardContent>
    </Card>
);

export default AdminKitchen;
