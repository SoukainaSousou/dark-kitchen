package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.User;
import com.example.backend_darkitchen.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        User user = userRepository.findByEmail(email).orElse(null);
            
        if (user == null) {
            return ResponseEntity.status(404).body("Admin non trouvé");
        }
        
        // Simple password comparison
        if (password != null && password.equals(user.getPassword())) {
            // Générer un token admin
            String token = "admin-token-" + user.getEmail() + "-" + System.currentTimeMillis();
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "admin", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "role", user.getRole(),
                    "phoneNumber", user.getPhoneNumber()
                )
            ));
        } else {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }
    }
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Admin Auth API is working"
        ));
    }
}