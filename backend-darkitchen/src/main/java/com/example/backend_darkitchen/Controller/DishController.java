package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.Dish;
import com.example.backend_darkitchen.Repository.DishRepository;
import com.example.backend_darkitchen.Service.DishService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000")
public class DishController {

    private final DishRepository dishRepository;
    @Autowired
    private DishService dishService;

    public DishController(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    // 🔥 Plats populaires
    @GetMapping("/featured")
    public List<Dish> getFeaturedDishes() {
        return dishRepository.findByPopularTrue();
    }

    // Tous les plats
    @GetMapping
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    // Plats par catégorie
    @GetMapping("/category/{categoryId}")
    public List<Dish> getDishesByCategory(@PathVariable Long categoryId) {
        return dishRepository.findByCategoryId(categoryId);
    }

   @PostMapping("/search-by-image")
public ResponseEntity<?> searchByImage(@RequestParam("image") MultipartFile image) {

    try {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://localhost:8000/detect-category",
                request,
                Map.class
        );

        String category = response.getBody().get("detected_category").toString();

        List<Dish> dishes =
                dishRepository.findByCategory_NameIgnoreCase(category);

        return ResponseEntity.ok(Map.of(
            "detected_category", category,
            "results", dishes
        ));

    } catch (IOException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Erreur lors de la lecture de l’image");
    }
}

    // 🔧 Get dish by ID
    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        return dishRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    private List<Dish> mapClipResponseToDishes(Map<String, Object> clipResponse) {
    List<Dish> resultDishes = new ArrayList<>();

    // Extraire la catégorie détectée
    Map<String, Object> detection = (Map<String, Object>) clipResponse.get("detection");
    String detectedCategory = detection != null ? (String) detection.get("category") : null;

    // Extraire les IDs des plats
    List<Long> dishIds = new ArrayList<>();
    List<?> results = (List<?>) clipResponse.get("results");
    if (results != null) {
        for (Object item : results) {
            if (item instanceof Number) dishIds.add(((Number) item).longValue());
        }
    }

    // Chercher les plats correspondants
    if (!dishIds.isEmpty()) {
        for (Long id : dishIds) {
            dishRepository.findById(id).ifPresent(resultDishes::add);
        }
    }

    // Si pas de plat spécifique mais catégorie détectée
    if (resultDishes.isEmpty() && detectedCategory != null) {
        resultDishes = dishRepository.findByCategoryNameIgnoreCaseContaining(detectedCategory);
    }

    return resultDishes;
}
@PostMapping
    public ResponseEntity<Dish> createDish(@RequestBody Dish dish) {
        System.out.println("=== CREATION PLAT ===");
        System.out.println("Nom: " + dish.getName());
        System.out.println("Prix: " + dish.getPrice());
        System.out.println("Catégorie ID: " + (dish.getCategory() != null ? dish.getCategory().getId() : "null"));
        
        Dish savedDish = dishService.createDish(dish);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDish);
    }

    // PUT mettre à jour un plat
    @PutMapping("/{id}")
    public ResponseEntity<Dish> updateDish(@PathVariable Long id, @RequestBody Dish dishDetails) {
        Dish updatedDish = dishService.updateDish(id, dishDetails);
        return ResponseEntity.ok(updatedDish);
    }

    // DELETE supprimer un plat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }

    // Gérer OPTIONS pour CORS
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
                .build();
    }
}