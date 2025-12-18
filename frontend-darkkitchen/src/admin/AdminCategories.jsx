import {
    Box,
    Typography,
    List,
    ListItem,
    TextField,
    Button,
    IconButton,
    Card,
    CardContent,
} from "@mui/material";
import { useState } from "react";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const AdminCategories = () => {
    const [categories, setCategories] = useState([
        "Burgers",
        "Pizzas",
        "Bowls",
    ]);

    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Add
    const handleAdd = () => {
        if (!newCategory.trim()) return;
        setCategories([...categories, newCategory]);
        setNewCategory("");
    };

    // Edit
    const handleSave = () => {
        const updated = [...categories];
        updated[editIndex] = editValue;
        setCategories(updated);
        setEditIndex(null);
    };

    // Delete
    const handleDelete = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    return (
        <Box maxWidth={500}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Catégories
            </Typography>

            {/* Add Category */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Ajouter une catégorie
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nom de la catégorie"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleAdd}>
                            Ajouter
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Categories List */}
            <List>
                {categories.map((cat, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            bgcolor: "white",
                            mb: 1,
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {editIndex === index ? (
                            <>
                                <TextField
                                    size="small"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                />
                                <Box>
                                    <IconButton color="success" onClick={handleSave}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setEditIndex(null)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography fontWeight={500}>{cat}</Typography>
                                <Box>
                                    <IconButton
                                        onClick={() => {
                                            setEditIndex(index);
                                            setEditValue(cat);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AdminCategories;
