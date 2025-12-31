package com.example.backend_darkitchen.Repository;

import com.example.backend_darkitchen.entity.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
 @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.dishes")
    List<Category> findAllWithDishes();
}
