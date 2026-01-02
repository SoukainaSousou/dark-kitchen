package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.dto.OrderRequestDTO;
import com.example.backend_darkitchen.dto.OrderResponseDTO;
import com.example.backend_darkitchen.entity.Order;
import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.Service.OrderService;
import com.example.backend_darkitchen.Service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ClientService clientService;
    
    // === ENDPOINTS EXISTANTS ===
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        try {
            // Validation basique
            if (orderRequest.getDishId() == null) {
                return ResponseEntity.badRequest().body("ID du plat requis");
            }
            
            if (orderRequest.getClientInfo() == null) {
                return ResponseEntity.badRequest().body("Informations client requises");
            }
            
            // Validation des champs obligatoires
            if (orderRequest.getClientInfo().getFirstName() == null || 
                orderRequest.getClientInfo().getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le prénom est requis");
            }
            
            if (orderRequest.getClientInfo().getLastName() == null || 
                orderRequest.getClientInfo().getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le nom est requis");
            }
            
            if (orderRequest.getClientInfo().getEmail() == null || 
                orderRequest.getClientInfo().getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("L'email est requis");
            }
            
            if (orderRequest.getClientInfo().getPhoneNumber() == null || 
                orderRequest.getClientInfo().getPhoneNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le téléphone est requis");
            }
            
            // Créer la commande
            Order order = orderService.createOrder(orderRequest);
            
            // Convertir en DTO pour la réponse
            OrderResponseDTO response = orderService.convertToDTO(order);
            
            // Ajouter des informations supplémentaires
            Map<String, Object> fullResponse = new HashMap<>();
            fullResponse.put("order", response);
            fullResponse.put("message", "Commande créée avec succès");
            fullResponse.put("estimatedDelivery", "25-30 minutes");
            
            return ResponseEntity.ok(fullResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable String orderNumber) {
        try {
            Optional<Order> orderOptional = orderService.getOrderByNumber(orderNumber);
            
            if (orderOptional.isPresent()) {
                OrderResponseDTO response = orderService.convertToDTO(orderOptional.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
                
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    // === NOUVEAUX ENDPOINTS POUR "MES COMMANDES" ===
    
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Vérifier l'authentification
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            // Extraire l'email du token (simplifié - à adapter selon votre système)
            String token = authHeader.substring(7);
            String email = extractEmailFromToken(token);
            
            if (email == null) {
                return ResponseEntity.status(401).body("Token invalide");
            }
            
            // Trouver le client par email
            Optional<Client> clientOptional = clientService.findByEmail(email);
            if (clientOptional.isEmpty()) {
                return ResponseEntity.status(404).body("Client non trouvé");
            }
            
            Client client = clientOptional.get();
            
            // Récupérer les commandes du client
            List<Order> orders = orderService.getOrdersByClient(client);
            
            // Convertir en DTO
            List<OrderResponseDTO> orderDTOs = orders.stream()
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(orderDTOs);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderId,
                                             @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Vérifier l'authentification
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            // Extraire l'email du token
            String token = authHeader.substring(7);
            String email = extractEmailFromToken(token);
            
            // Récupérer la commande
            Optional<Order> orderOptional = orderService.getOrderById(orderId);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOptional.get();
            
            // Vérifier que la commande appartient au client
            if (!order.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Accès non autorisé à cette commande");
            }
            
            // Convertir en DTO détaillé
            OrderResponseDTO response = orderService.convertToDetailedDTO(order);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-number/{orderNumber}")
    public ResponseEntity<?> getOrderByNumber(@PathVariable String orderNumber,
                                              @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Vérifier l'authentification
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            // Extraire l'email du token
            String token = authHeader.substring(7);
            String email = extractEmailFromToken(token);
            
            // Récupérer la commande
            Optional<Order> orderOptional = orderService.getOrderByNumber(orderNumber);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOptional.get();
            
            // Vérifier que la commande appartient au client
            if (!order.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Accès non autorisé à cette commande");
            }
            
            // Convertir en DTO détaillé
            OrderResponseDTO response = orderService.convertToDetailedDTO(order);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Vérifier l'authentification
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            // Extraire l'email du token
            String token = authHeader.substring(7);
            String email = extractEmailFromToken(token);
            
            // Récupérer la commande
            Optional<Order> orderOptional = orderService.getOrderById(orderId);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOptional.get();
            
            // Vérifier que la commande appartient au client
            if (!order.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Accès non autorisé à cette commande");
            }
            
            // Vérifier si la commande peut être annulée
            if (!orderService.canOrderBeCancelled(order)) {
                return ResponseEntity.badRequest().body("Cette commande ne peut plus être annulée");
            }
            
            // Annuler la commande
            Order cancelledOrder = orderService.cancelOrder(orderId);
            OrderResponseDTO response = orderService.convertToDTO(cancelledOrder);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable Long orderId,
                                          @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Vérifier l'authentification
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            // Extraire l'email du token
            String token = authHeader.substring(7);
            String email = extractEmailFromToken(token);
            
            // Récupérer la commande
            Optional<Order> orderOptional = orderService.getOrderById(orderId);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOptional.get();
            
            // Vérifier que la commande appartient au client
            if (!order.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Accès non autorisé à cette commande");
            }
            
            // Vérifier si la commande peut être confirmée
            if (!orderService.canOrderBeConfirmed(order)) {
                return ResponseEntity.badRequest().body("Cette commande ne peut plus être confirmée");
            }
            
            // Confirmer la commande
            Order confirmedOrder = orderService.confirmOrder(orderId);
            OrderResponseDTO response = orderService.convertToDTO(confirmedOrder);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur serveur: " + e.getMessage());
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Order API is working",
            "endpoints", List.of(
                "POST /api/orders - Créer une commande",
                "GET /api/orders/my-orders - Mes commandes",
                "GET /api/orders/{id} - Détails commande",
                "PUT /api/orders/{id}/cancel - Annuler commande",
                "PUT /api/orders/{id}/confirm - Confirmer commande",
                "GET /api/orders/track/{orderNumber} - Suivre commande"
            )
        ));
    }
    
    // === MÉTHODES UTILITAIRES ===
    
    private String extractEmailFromToken(String token) {
        try {
            // Pour vos tokens mock: "client-token-email-timestamp"
            if (token.startsWith("client-token-")) {
                // Format: client-token-john@example.com-1705345678901
                String[] parts = token.split("-");
                if (parts.length >= 4) {
                    // L'email est la 3ème partie (index 2)
                    return parts[2];
                }
            }
            
            // Pour les tokens admin
            if (token.startsWith("admin-token-")) {
                String[] parts = token.split("-");
                if (parts.length >= 4) {
                    return parts[2];
                }
            }
            
            // Si ce n'est pas un format reconnu, on peut simplement retourner le token
            // ou lancer une exception selon votre besoin
            System.out.println("Token format non reconnu: " + token);
            return null;
            
        } catch (Exception e) {
            System.err.println("Erreur extraction email du token: " + e.getMessage());
            return null;
        }
    }
}