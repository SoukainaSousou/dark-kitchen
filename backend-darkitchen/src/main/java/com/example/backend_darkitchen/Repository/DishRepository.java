package com.example.backend_darkitchen.Repository;

import com.example.backend_darkitchen.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByPopularTrue();
    List<Dish> findByCategoryId(Long categoryId); // nouvelle méthode
    List<Dish> findByCategoryNameIgnoreCaseContaining(String categoryName);
    List<Dish> findByCategory_NameIgnoreCase(String name);

}
