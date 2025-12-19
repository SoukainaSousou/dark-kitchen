package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.User;
import com.example.backend_darkitchen.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    // REMOVED BCrypt - Simple password comparison
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);
        System.out.println("Password provided: " + password);
        
        User user = userRepository.findByEmail(email)
            .orElse(null);
            
        if (user == null) {
            System.out.println("User not found");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email ou mot de passe incorrect"
            ));
        }
        
        System.out.println("User found: " + user.getEmail());
        System.out.println("Password in DB: " + user.getPassword());
        
        // Simple password comparison
        if (password != null && password.equals(user.getPassword())) {
            System.out.println("SUCCESS: Password matches!");
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole()
            ));
        } else {
            System.out.println("FAIL: Password doesn't match");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email ou mot de passe incorrect"
            ));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
        String fullName = userData.get("fullName");
        String phoneNumber = userData.get("phoneNumber");
        
        System.out.println("=== REGISTER ATTEMPT ===");
        System.out.println("Email: " + email);
        
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email déjà utilisé"
            ));
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(password); // Store plain password for now
        user.setFullName(fullName);
        user.setPhoneNumber(phoneNumber);
        user.setRole("USER");
        
        User savedUser = userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "id", savedUser.getId(),
            "email", savedUser.getEmail(),
            "fullName", savedUser.getFullName(),
            "role", savedUser.getRole()
        ));
    }
    
    // Test endpoint
    @GetMapping("/test-connection")
    public ResponseEntity<?> testConnection() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Auth API is working"
        ));
    }
}