package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.User;
import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.entity.User.UserRole;
import com.example.backend_darkitchen.Repository.UserRepository;
import com.example.backend_darkitchen.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    // Endpoint unifié de login (auto-détection)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        System.out.println("=== LOGIN ATTEMPT (Unified) ===");
        System.out.println("Email: " + email);
        
        // Chercher d'abord dans les staff (Users)
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            System.out.println("Found in User table - Role: " + user.get().getRole());
            
            if (password != null && password.equals(user.get().getPassword())) {
                System.out.println("SUCCESS: Staff login");
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.get().getId());
                response.put("email", user.get().getEmail());
                response.put("fullName", user.get().getFullName());
                response.put("role", user.get().getRole().toString());
                response.put("type", "STAFF");
                
                return ResponseEntity.ok(response);
            }
        }
        
        // Chercher dans les clients
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            System.out.println("Found in Client table");
            
            if (password != null && password.equals(client.get().getPassword())) {
                System.out.println("SUCCESS: Client login");
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", client.get().getId());
                response.put("email", client.get().getEmail());
                response.put("firstName", client.get().getFirstName());
                response.put("lastName", client.get().getLastName());
                response.put("fullName", client.get().getFullName());
                response.put("phoneNumber", client.get().getPhoneNumber());
                response.put("address", client.get().getAddress());
                response.put("city", client.get().getCity());
                response.put("postalCode", client.get().getPostalCode());
                response.put("role", "CLIENT");
                response.put("type", "CLIENT");
                
                return ResponseEntity.ok(response);
            }
        }
        
        System.out.println("FAIL: User not found or password incorrect");
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Email ou mot de passe incorrect"
        ));
    }
    
    // Endpoint spécifique pour les staff
    @PostMapping("/staff/login")
    public ResponseEntity<?> staffLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        System.out.println("=== STAFF LOGIN ATTEMPT ===");
        
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent() && password.equals(user.get().getPassword())) {
            System.out.println("SUCCESS: Staff login");
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.get().getId());
            response.put("email", user.get().getEmail());
            response.put("fullName", user.get().getFullName());
            response.put("role", user.get().getRole().toString());
            response.put("type", "STAFF");
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Identifiants staff incorrects"
        ));
    }
    
    // Endpoint spécifique pour les clients
    @PostMapping("/client/login")
    public ResponseEntity<?> clientLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        System.out.println("=== CLIENT LOGIN ATTEMPT ===");
        
        Optional<Client> client = clientRepository.findByEmail(email);
        
        if (client.isPresent() && password.equals(client.get().getPassword())) {
            System.out.println("SUCCESS: Client login");
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", client.get().getId());
            response.put("email", client.get().getEmail());
            response.put("firstName", client.get().getFirstName());
            response.put("lastName", client.get().getLastName());
            response.put("fullName", client.get().getFullName());
            response.put("phoneNumber", client.get().getPhoneNumber());
            response.put("address", client.get().getAddress());
            response.put("city", client.get().getCity());
            response.put("postalCode", client.get().getPostalCode());
            response.put("role", "CLIENT");
            response.put("type", "CLIENT");
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Identifiants client incorrects"
        ));
    }
    
    // Inscription client
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
        String firstName = userData.get("firstName");
        String lastName = userData.get("lastName");
        String phoneNumber = userData.get("phoneNumber");
        String address = userData.get("address");
        String city = userData.get("city");
        String postalCode = userData.get("postalCode");
        
        System.out.println("=== CLIENT REGISTER ATTEMPT ===");
        System.out.println("Email: " + email);
        
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(email) || clientRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email déjà utilisé"
            ));
        }
        
        // Créer un nouveau client
        Client client = new Client();
        client.setFirstName(firstName);
        client.setLastName(lastName);
        client.setEmail(email);
        client.setPassword(password);
        client.setPhoneNumber(phoneNumber);
        client.setAddress(address);
        client.setCity(city);
        client.setPostalCode(postalCode);
        
        Client savedClient = clientRepository.save(client);
        
        // Créer la réponse avec HashMap pour plus de 10 champs
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedClient.getId());
        response.put("email", savedClient.getEmail());
        response.put("firstName", savedClient.getFirstName());
        response.put("lastName", savedClient.getLastName());
        response.put("fullName", savedClient.getFullName());
        response.put("phoneNumber", savedClient.getPhoneNumber());
        response.put("address", savedClient.getAddress());
        response.put("city", savedClient.getCity());
        response.put("postalCode", savedClient.getPostalCode());
        response.put("role", "CLIENT");
        response.put("type", "CLIENT");
        
        return ResponseEntity.ok(response);
    }
    
    // Vérifier si un email existe
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        // Vérifier dans User (staff)
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("exists", true);
            response.put("type", "STAFF");
            response.put("role", user.get().getRole().toString());
            return ResponseEntity.ok(response);
        }
        
        // Vérifier dans Client
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("exists", true);
            response.put("type", "CLIENT");
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok(Map.of("exists", false));
    }
    
    // Test endpoint
    @GetMapping("/test-connection")
    public ResponseEntity<?> testConnection() {
        long userCount = userRepository.count();
        long clientCount = clientRepository.count();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Auth API is working");
        response.put("userCount", userCount);
        response.put("clientCount", clientCount);
        
        return ResponseEntity.ok(response);
    }
}