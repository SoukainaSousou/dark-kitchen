package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.entity.Order;
import com.example.backend_darkitchen.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {
    
    @Autowired
    private ClientRepository clientRepository;
    
    // Récupérer tous les clients
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return ResponseEntity.ok(clients);
    }
    
    // Récupérer un client par ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return client.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    // Mettre à jour un client
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Map<String, String> clientData) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        
        if (!optionalClient.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Client client = optionalClient.get();
        
        // Mettre à jour les champs
        if (clientData.containsKey("firstName")) {
            client.setFirstName(clientData.get("firstName"));
        }
        if (clientData.containsKey("lastName")) {
            client.setLastName(clientData.get("lastName"));
        }
        if (clientData.containsKey("phoneNumber")) {
            client.setPhoneNumber(clientData.get("phoneNumber"));
        }
        if (clientData.containsKey("address")) {
            client.setAddress(clientData.get("address"));
        }
        if (clientData.containsKey("city")) {
            client.setCity(clientData.get("city"));
        }
        if (clientData.containsKey("postalCode")) {
            client.setPostalCode(clientData.get("postalCode"));
        }
        if (clientData.containsKey("password") && !clientData.get("password").isEmpty()) {
            client.setPassword(clientData.get("password"));
        }
        if (clientData.containsKey("active")) {
            client.setActive(Boolean.parseBoolean(clientData.get("active")));
        }
        
        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok(updatedClient);
    }
    
    // Désactiver un client (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        
        if (!optionalClient.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Client client = optionalClient.get();
        client.setActive(false);
        clientRepository.save(client);
        
        return ResponseEntity.ok(Map.of(
            "message", "Client désactivé avec succès"
        ));
    }
    
    // Réactiver un client
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateClient(@PathVariable Long id) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        
        if (!optionalClient.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Client client = optionalClient.get();
        client.setActive(true);
        clientRepository.save(client);
        
        return ResponseEntity.ok(Map.of(
            "message", "Client réactivé avec succès"
        ));
    }
    
    // Statistiques des clients
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getClientStats() {
        long totalClients = clientRepository.count();
        long activeClients = clientRepository.findAll().stream()
            .filter(Client::isActive)
            .count();
        
        return ResponseEntity.ok(Map.of(
            "total", totalClients,
            "active", activeClients,
            "inactive", totalClients - activeClients
        ));
    }


    // Ajoutez ce nouvel endpoint spécifique pour le changement de mot de passe
@PutMapping("/{id}/change-password")
public ResponseEntity<?> changePassword(
        @PathVariable Long id,
        @RequestBody Map<String, String> passwordData) {
    
    Optional<Client> optionalClient = clientRepository.findById(id);
    
    if (!optionalClient.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    
    Client client = optionalClient.get();
    
    // Vérifier que tous les champs sont présents
    if (!passwordData.containsKey("currentPassword") || 
        !passwordData.containsKey("newPassword")) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Les champs 'currentPassword' et 'newPassword' sont requis"));
    }
    
    String currentPassword = passwordData.get("currentPassword");
    String newPassword = passwordData.get("newPassword");
    
    // Vérifier le mot de passe actuel
    if (!client.getPassword().equals(currentPassword)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Mot de passe actuel incorrect"));
    }
    
    // Vérifier que le nouveau mot de passe est différent
    if (currentPassword.equals(newPassword)) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Le nouveau mot de passe doit être différent de l'ancien"));
    }
    
    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length() < 6) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Le nouveau mot de passe doit contenir au moins 6 caractères"));
    }
    
    // Changer le mot de passe
    client.setPassword(newPassword);
    Client updatedClient = clientRepository.save(client);
    
    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "Mot de passe modifié avec succès",
        "client", updatedClient
    ));
}


// Dans ClientController.java, ajoutez cette méthode :
@GetMapping("/{id}/stats")
public ResponseEntity<?> getClientStats(@PathVariable Long id) {
    Optional<Client> optionalClient = clientRepository.findById(id);
    
    if (!optionalClient.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    
    Client client = optionalClient.get();
    
    // Récupérer le nombre de commandes pour ce client
    long orderCount = client.getOrders() != null ? client.getOrders().size() : 0;
    
    // Calculer le montant total dépensé
    double totalSpent = 0.0;
    if (client.getOrders() != null) {
        totalSpent = client.getOrders().stream()
            .filter(order -> order.getTotalAmount() != null)
            .mapToDouble(Order::getTotalAmount)
            .sum();
    }
    
    return ResponseEntity.ok(Map.of(
        "clientId", id,
        "fullName", client.getFullName(),
        "orderCount", orderCount,
        "totalSpent", totalSpent,
        "registrationDate", client.getRegistrationDate(),
        "lastOrderDate", getLastOrderDate(client),
        "active", client.isActive()
    ));
}

private LocalDateTime getLastOrderDate(Client client) {
    if (client.getOrders() == null || client.getOrders().isEmpty()) {
        return null;
    }
    return client.getOrders().stream()
        .map(Order::getOrderDate)
        .max(LocalDateTime::compareTo)
        .orElse(null);
}

}