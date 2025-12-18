import {
    Box,
    Typography,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Button,
    IconButton,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { useState } from "react";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const roles = ["admin", "cuisinier", "livreur"];

const AdminUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Admin", role: "admin" },
        { id: 2, name: "Ali", role: "cuisinier" },
        { id: 3, name: "Yassine", role: "livreur" },
    ]);

    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState({ name: "", role: "" });

    const [newUser, setNewUser] = useState({ name: "", role: "cuisinier" });

    const [deleteIndex, setDeleteIndex] = useState(null);

    // Ajouter utilisateur
    const handleAddUser = () => {
        if (!newUser.name.trim()) return;
        setUsers([...users, { id: Date.now(), ...newUser }]);
        setNewUser({ name: "", role: "cuisinier" });
    };

    // Sauvegarder modification
    const handleSave = () => {
        const updated = [...users];
        updated[editIndex] = { ...updated[editIndex], ...editValue };
        setUsers(updated);
        setEditIndex(null);
    };

    // Supprimer
    const handleDelete = () => {
        setUsers(users.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
    };

    return (
        <Box maxWidth={700}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Utilisateurs
            </Typography>

            {/* Ajouter utilisateur */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Ajouter un utilisateur
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            size="small"
                            label="Nom"
                            value={newUser.name}
                            onChange={(e) =>
                                setNewUser({ ...newUser, name: e.target.value })
                            }
                            fullWidth
                        />
                        <Select
                            size="small"
                            value={newUser.role}
                            onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                            }
                        >
                            {roles.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" onClick={handleAddUser}>
                            Ajouter
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Table Utilisateurs */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Rôle</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((u, index) => (
                        <TableRow key={u.id} hover>
                            {editIndex === index ? (
                                <>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={editValue.name}
                                            onChange={(e) =>
                                                setEditValue({ ...editValue, name: e.target.value })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={editValue.role}
                                            onChange={(e) =>
                                                setEditValue({ ...editValue, role: e.target.value })
                                            }
                                        >
                                            {roles.map((r) => (
                                                <MenuItem key={r} value={r}>
                                                    {r}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="success" onClick={handleSave}>
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton onClick={() => setEditIndex(null)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => {
                                                setEditIndex(index);
                                                setEditValue({ name: u.name, role: u.role });
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => setDeleteIndex(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog confirmation suppression */}
            <Dialog
                open={deleteIndex !== null}
                onClose={() => setDeleteIndex(null)}
            >
                <DialogTitle>Supprimer utilisateur</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment supprimer {users[deleteIndex]?.name} ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteIndex(null)}>Annuler</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUsers;
