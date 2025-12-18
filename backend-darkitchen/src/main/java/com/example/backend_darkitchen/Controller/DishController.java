package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.Dish;
import com.example.backend_darkitchen.Repository.DishRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000")
public class DishController {

    private final DishRepository dishRepository;

    public DishController(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    // 🔥 Plats populaires
    @GetMapping("/featured")
    public List<Dish> getFeaturedDishes() {
        return dishRepository.findByPopularTrue();
    }

    // (optionnel) Tous les plats
    @GetMapping
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }
    
}
