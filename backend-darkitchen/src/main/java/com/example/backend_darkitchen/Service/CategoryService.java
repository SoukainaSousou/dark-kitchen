package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.Repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private DishRepository dishRepository;

    // Récupérer toutes les catégories distinctes avec le nombre de plats
    public List<Map<String, Object>> getAllCategoriesWithCount() {
        List<String> categories = dishRepository.findDistinctCategories();
        
        return categories.stream()
            .map(category -> {
                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("name", category);
                categoryData.put("count", dishRepository.countByCategory(category));
                // Vous pouvez ajouter d'autres informations si nécessaire
                return categoryData;
            })
            .collect(Collectors.toList());
    }

    // Version simple : juste les noms des catégories
    public List<String> getAllCategories() {
        return dishRepository.findDistinctCategories();
    }
}