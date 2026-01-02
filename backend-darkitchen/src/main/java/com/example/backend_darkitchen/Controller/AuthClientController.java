package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.dto.LoginRequestDTO;
import com.example.backend_darkitchen.dto.LoginResponseDTO;
import com.example.backend_darkitchen.dto.ClientRegistrationDTO;
import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.Service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/client")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthClientController {
    
    @Autowired
    private ClientService clientService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            Optional<Client> clientOptional = clientService.findByEmail(loginRequest.getEmail());
            
            if (clientOptional.isEmpty()) {
                return ResponseEntity.status(404).body("Client non trouvé");
            }
            
            Client client = clientOptional.get();
            
            // Validation simple sans cryptage
            if (!clientService.validatePassword(loginRequest.getPassword(), client.getPassword())) {
                return ResponseEntity.status(401).body("Mot de passe incorrect");
            }
            
            if (!client.isActive()) {
                return ResponseEntity.status(403).body("Compte désactivé");
            }
            
            // Générer un token client
            String token = "client-token-" + client.getEmail() + "-" + System.currentTimeMillis();
            
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setClient(clientService.convertToDTO(client));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'authentification: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody ClientRegistrationDTO registrationDTO) {
        try {
            // Vérifier si l'email existe déjà
            if (clientService.findByEmail(registrationDTO.getEmail()).isPresent()) {
                return ResponseEntity.status(409).body("Cet email est déjà utilisé");
            }
            
            // Créer le client
            Client client = clientService.registerClient(
                registrationDTO.getFirstName(),
                registrationDTO.getLastName(),
                registrationDTO.getEmail(),
                registrationDTO.getPassword(),
                registrationDTO.getPhoneNumber(),
                registrationDTO.getAddress(),
                registrationDTO.getCity(),
                registrationDTO.getPostalCode()
            );
            
            // Générer un token
            String token = "client-token-" + client.getEmail() + "-" + System.currentTimeMillis();
            
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setClient(clientService.convertToDTO(client));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'inscription: " + e.getMessage());
        }
    }
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Client Auth API is working"
        ));
    }
}