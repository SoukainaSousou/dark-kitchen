package com.example.backend_darkitchen.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_darkitchen.entity.Dish;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    // basé sur le champ "popular"
    List<Dish> findByPopularTrue();
}
