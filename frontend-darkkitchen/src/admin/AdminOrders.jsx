import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useState } from "react";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const statusConfig = {
    Préparation: {
        color: "warning",
        icon: <RestaurantIcon fontSize="small" />,
    },
    Livraison: {
        color: "info",
        icon: <LocalShippingIcon fontSize="small" />,
    },
    Livrée: {
        color: "success",
        icon: <CheckCircleIcon fontSize="small" />,
    },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([
        { id: 1023, client: "Karim", total: "29€", status: "Préparation" },
        { id: 1024, client: "Sara", total: "18€", status: "Livraison" },
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteOrder, setDeleteOrder] = useState(null);

    const handleStatusChange = (id, status) => {
        setOrders(
            orders.map((o) =>
                o.id === id ? { ...o, status } : o
            )
        );
    };

    const confirmDelete = () => {
        setOrders(orders.filter((o) => o.id !== deleteOrder.id));
        setDeleteOrder(null);
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Commandes
            </Typography>

            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    hover
                                    sx={{
                                        "&:hover": {
                                            bgcolor: "action.hover",
                                        },
                                    }}
                                >
                                    <TableCell fontWeight={600}>
                                        #{order.id}
                                    </TableCell>
                                    <TableCell>{order.client}</TableCell>
                                    <TableCell>{order.total}</TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order.id, e.target.value)
                                            }
                                            sx={{
                                                bgcolor: "grey.100",
                                                borderRadius: 2,
                                            }}
                                        >
                                            {Object.keys(statusConfig).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        {statusConfig[status].icon}
                                                        {status}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => setDeleteOrder(order)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog
                open={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
            >
                <DialogTitle>Détails commande</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography>ID : #{selectedOrder.id}</Typography>
                            <Typography>Client : {selectedOrder.client}</Typography>
                            <Typography>Total : {selectedOrder.total}</Typography>
                            <Chip
                                sx={{ mt: 2 }}
                                icon={statusConfig[selectedOrder.status].icon}
                                label={selectedOrder.status}
                                color={statusConfig[selectedOrder.status].color}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={Boolean(deleteOrder)}
                onClose={() => setDeleteOrder(null)}
            >
                <DialogTitle>Supprimer commande</DialogTitle>
                <DialogContent>
                    Supprimer la commande #{deleteOrder?.id} ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOrder(null)}>
                        Annuler
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmDelete}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrders;
