package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.entity.Dish;
import com.example.backend_darkitchen.entity.Category;
import com.example.backend_darkitchen.Repository.DishRepository;
import com.example.backend_darkitchen.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Tous les plats
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    // Un plat par ID
    public Dish getDishById(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + id));
    }

    // Créer un plat - VERSION CORRIGÉE
    @Transactional
    public Dish createDish(Dish dish) {
        System.out.println("=== SERVICE: Création plat ===");
        System.out.println("Nom: " + dish.getName());
        System.out.println("Prix: " + dish.getPrice());
        
        // Vérifier et charger la catégorie
        if (dish.getCategory() != null && dish.getCategory().getId() != null) {
            Long categoryId = dish.getCategory().getId();
            System.out.println("Catégorie ID reçu: " + categoryId);
            
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> {
                        System.out.println("Catégorie non trouvée avec ID: " + categoryId);
                        return new RuntimeException("Catégorie non trouvée avec l'id: " + categoryId);
                    });
            
            System.out.println("Catégorie trouvée: " + category.getName());
            dish.setCategory(category);
        } else {
            System.out.println("Aucune catégorie fournie");
            throw new RuntimeException("Une catégorie est requise");
        }
        
        Dish savedDish = dishRepository.save(dish);
        System.out.println("Plat sauvegardé avec ID: " + savedDish.getId());
        return savedDish;
    }

    // Mettre à jour un plat - VERSION CORRIGÉE
    @Transactional
    public Dish updateDish(Long id, Dish dishDetails) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + id));

        // Mettre à jour les champs
        if (dishDetails.getName() != null) {
            dish.setName(dishDetails.getName());
        }
        if (dishDetails.getDescription() != null) {
            dish.setDescription(dishDetails.getDescription());
        }
        if (dishDetails.getPrice() > 0) { // Modification pour double
            dish.setPrice(dishDetails.getPrice());
        }
        if (dishDetails.getImage() != null) {
            dish.setImage(dishDetails.getImage());
        }
        if (dishDetails.getPrepTime() != null) {
            dish.setPrepTime(dishDetails.getPrepTime());
        }
        if (dishDetails.getRating() > 0) { // Modification pour double
            dish.setRating(dishDetails.getRating());
        }
        
        // Utiliser les nouveaux getters
        dish.setIsPopular(dishDetails.getIsPopular());
        dish.setIsNew(dishDetails.getIsNew());
        
        // Mettre à jour la catégorie
        if (dishDetails.getCategory() != null && dishDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(dishDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            dish.setCategory(category);
        }

        return dishRepository.save(dish);
    }

    // Supprimer un plat
    @Transactional
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'id: " + id));
        dishRepository.delete(dish);
    }
}