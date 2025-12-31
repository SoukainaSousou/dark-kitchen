package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.entity.Category;
import com.example.backend_darkitchen.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Toutes les catégories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Créer une catégorie (AJOUTEZ CETTE MÉTHODE)
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Mettre à jour une catégorie (AJOUTEZ CETTE MÉTHODE)
    public Category updateCategory(Long id, Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            
            // Mettre à jour les champs
            if (categoryDetails.getName() != null) {
                category.setName(categoryDetails.getName());
            }
            if (categoryDetails.getDescription() != null) {
                category.setDescription(categoryDetails.getDescription());
            }
            if (categoryDetails.getIcon() != null) {
                category.setIcon(categoryDetails.getIcon());
            }
            
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Catégorie non trouvée avec l'id: " + id);
        }
    }

    // Supprimer une catégorie (AJOUTEZ CETTE MÉTHODE)
    public void deleteCategory(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        
        if (optionalCategory.isPresent()) {
            categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Catégorie non trouvée avec l'id: " + id);
        }
    }

    // Trouver par ID (optionnel mais utile)
    public Category getCategoryById(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        
        if (optionalCategory.isPresent()) {
            return optionalCategory.get();
        } else {
            throw new RuntimeException("Catégorie non trouvée avec l'id: " + id);
        }
    }
      public List<Category> getAllCategoriesWithDishes() {
        return categoryRepository.findAllWithDishes();
    }
    
}