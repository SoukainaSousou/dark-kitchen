package com.example.backend_darkitchen.Controller;

import com.example.backend_darkitchen.dto.OrderRequestDTO;
import com.example.backend_darkitchen.dto.ClientLoginDTO;
import com.example.backend_darkitchen.dto.OrderResponseDTO;
import com.example.backend_darkitchen.entity.Order;
import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        try {
            Order order = orderService.createOrder(orderRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", order.getId());
            response.put("status", order.getStatus());
            response.put("totalAmount", order.getTotalAmount());
            response.put("clientId", order.getClient().getId());
            response.put("message", "Commande créée avec succès");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }
    
    @PostMapping("/check-client")
    public ResponseEntity<?> checkClientExists(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = orderService.checkClientExists(email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> clientLogin(@RequestBody ClientLoginDTO loginDTO) {
        Client client = orderService.authenticateClient(loginDTO.getEmail(), loginDTO.getPassword());
        
        Map<String, Object> response = new HashMap<>();
        
        if (client != null) {
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("client", Map.of(
                "id", client.getId(),
                "email", client.getEmail(),
                "fullName", client.getFullName(),
                "phoneNumber", client.getPhoneNumber()
            ));
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getClientOrders(
            @PathVariable Long clientId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sortBy) {
        
        try {
            List<OrderResponseDTO> orders = orderService.getClientOrders(clientId, status, startDate, endDate, sortBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", orders.size());
            response.put("orders", orders);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            OrderResponseDTO order = orderService.getOrderById(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }
    
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        try {
            String reason = request.get("reason");
            OrderResponseDTO cancelledOrder = orderService.cancelOrder(orderId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande annulée avec succès");
            response.put("order", cancelledOrder);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }
    
    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<?> reorder(@PathVariable Long orderId) {
        try {
            OrderResponseDTO newOrder = orderService.reorder(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande recréée avec succès");
            response.put("order", newOrder);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }
    
    // DTO pour la connexion
    public static class ClientLoginDTO {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}