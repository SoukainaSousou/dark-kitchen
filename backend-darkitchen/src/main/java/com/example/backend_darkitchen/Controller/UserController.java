package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.User;
import com.example.backend_darkitchen.entity.User.UserRole;
import com.example.backend_darkitchen.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    // Récupérer tous les utilisateurs (staff)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    // Récupérer les utilisateurs par rôle
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<User> users = userRepository.findByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    // Rechercher des utilisateurs
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.searchUsers(query);
        return ResponseEntity.ok(users);
    }
    
    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // Créer un nouvel utilisateur (staff) - SEULEMENT POUR ADMIN
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
        String fullName = userData.get("fullName");
        String phoneNumber = userData.get("phoneNumber");
        String roleStr = userData.get("role");
        
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email déjà utilisé"
            ));
        }
        
        // Convertir le rôle
        UserRole role;
        try {
            role = UserRole.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Rôle invalide. Rôles disponibles: ADMIN, CHEF, DRIVER"
            ));
        }
        
        // Créer l'utilisateur
        User user = new User(email, password, fullName, phoneNumber, role);
        User savedUser = userRepository.save(user);
        
        return ResponseEntity.ok(savedUser);
    }
    
    // Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userData) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = optionalUser.get();
        
        // Mettre à jour les champs
        if (userData.containsKey("fullName")) {
            user.setFullName(userData.get("fullName"));
        }
        if (userData.containsKey("phoneNumber")) {
            user.setPhoneNumber(userData.get("phoneNumber"));
        }
        if (userData.containsKey("password") && !userData.get("password").isEmpty()) {
            user.setPassword(userData.get("password"));
        }
        if (userData.containsKey("role")) {
            try {
                UserRole role = UserRole.valueOf(userData.get("role").toUpperCase());
                user.setRole(role);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Rôle invalide"
                ));
            }
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
    
    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Utilisateur supprimé avec succès"
        ));
    }
    
    // Compter les utilisateurs par rôle
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        long adminCount = userRepository.findByRole(UserRole.ADMIN).size();
        long chefCount = userRepository.findByRole(UserRole.CHEF).size();
        long driverCount = userRepository.findByRole(UserRole.DRIVER).size();
        
        return ResponseEntity.ok(Map.of(
            "admin", adminCount,
            "chef", chefCount,
            "driver", driverCount,
            "total", userRepository.count()
        ));
    }
}