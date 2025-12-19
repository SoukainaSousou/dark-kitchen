package com.example.backend_darkitchen.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend_darkitchen.entity.Dish;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    // basé sur le champ "popular"
    List<Dish> findByPopularTrue();
      // Ajouter cette méthode pour récupérer les catégories distinctes
    @Query("SELECT DISTINCT d.category FROM Dish d WHERE d.category IS NOT NULL AND d.category <> '' ORDER BY d.category")
    List<String> findDistinctCategories();
     // Compter les plats par catégorie
    @Query("SELECT COUNT(d) FROM Dish d WHERE d.category = :category")
    long countByCategory(@Param("category") String category);
}
