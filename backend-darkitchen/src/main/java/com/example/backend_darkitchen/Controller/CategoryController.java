package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000") // Ajustez selon votre frontend
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Endpoint pour récupérer toutes les catégories avec le nombre de plats
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        try {
            List<Map<String, Object>> categories = categoryService.getAllCategoriesWithCount();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint pour récupérer seulement les noms des catégories
    @GetMapping("/categories/names")
    public ResponseEntity<List<String>> getCategoryNames() {
        try {
            List<String> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}