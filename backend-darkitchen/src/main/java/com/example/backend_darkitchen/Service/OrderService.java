package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.entity.*;
import com.example.backend_darkitchen.Repository.*;
import com.example.backend_darkitchen.dto.OrderRequestDTO;
import com.example.backend_darkitchen.dto.OrderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private DishRepository dishRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ClientService clientService;
    
    @Transactional
    public Order createOrder(OrderRequestDTO orderRequest) {
        // 1. Gérer le client (créer ou trouver)
        Client client;
        
        if (orderRequest.getClientInfo().isCreateAccount()) {
            // Créer un nouveau client
            client = clientService.registerClient(
                orderRequest.getClientInfo().getFirstName(),
                orderRequest.getClientInfo().getLastName(),
                orderRequest.getClientInfo().getEmail(),
                orderRequest.getClientInfo().getPassword(),
                orderRequest.getClientInfo().getPhoneNumber(),
                orderRequest.getClientInfo().getAddress(),
                orderRequest.getClientInfo().getCity(),
                orderRequest.getClientInfo().getPostalCode()
            );
        } else {
            // Vérifier si le client existe déjà par email
            client = clientRepository.findByEmail(orderRequest.getClientInfo().getEmail())
                .orElseGet(() -> {
                    // Créer un client sans mot de passe (pour commande sans compte)
                    Client newClient = new Client();
                    newClient.setFirstName(orderRequest.getClientInfo().getFirstName());
                    newClient.setLastName(orderRequest.getClientInfo().getLastName());
                    newClient.setEmail(orderRequest.getClientInfo().getEmail());
                    newClient.setPhoneNumber(orderRequest.getClientInfo().getPhoneNumber());
                    newClient.setAddress(orderRequest.getClientInfo().getAddress());
                    newClient.setCity(orderRequest.getClientInfo().getCity());
                    newClient.setPostalCode(orderRequest.getClientInfo().getPostalCode());
                    newClient.setRegistrationDate(LocalDateTime.now());
                    newClient.setActive(false); // Compte inactif (pas de connexion)
                    return clientRepository.save(newClient);
                });
        }
        
        // 2. Créer la commande
        Order order = new Order(client);
        order.setDeliveryAddress(orderRequest.getClientInfo().getAddress());
        order.setDeliveryCity(orderRequest.getClientInfo().getCity());
        order.setDeliveryPostalCode(orderRequest.getClientInfo().getPostalCode());
        order.setSpecialInstructions(orderRequest.getSpecialInstructions());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setPaymentMethod("À la livraison");
        
        // 3. Ajouter le plat à la commande
        Dish dish = dishRepository.findById(orderRequest.getDishId())
            .orElseThrow(() -> new RuntimeException("Plat non trouvé"));
        
        OrderItem orderItem = new OrderItem();
        orderItem.setDish(dish);
        orderItem.setQuantity(orderRequest.getQuantity());
        orderItem.setPrice(dish.getPrice());
        orderItem.setSpecialRequest(orderRequest.getSpecialInstructions());
        
        order.addOrderItem(orderItem);
        
        // 4. Sauvegarder la commande
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.save(orderItem);
        
        return savedOrder;
    }
    
    public List<Order> getClientOrders(Long clientId) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return orderRepository.findByClientOrderByOrderDateDesc(client);
    }
    
    // CORRECTION ICI: Ajouter Optional<>
    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    public OrderResponseDTO convertToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setClientName(order.getClient().getFullName());
        dto.setClientEmail(order.getClient().getEmail());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentStatus(order.getPaymentStatus().name());
        return dto;
    }

     public List<Order> getOrdersByClient(Client client) {
        return orderRepository.findByClientOrderByOrderDateDesc(client);
    }
    
    // Récupérer une commande par ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

     // Annuler une commande
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        // Vérifier si la commande peut être annulée
        if (!canOrderBeCancelled(order)) {
            throw new RuntimeException("Cette commande ne peut plus être annulée");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
    
    // Confirmer une commande (paiement)
    public Order confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        // Vérifier si la commande peut être confirmée
        if (!canOrderBeConfirmed(order)) {
            throw new RuntimeException("Cette commande ne peut plus être confirmée");
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        return orderRepository.save(order);
    }
    
    // Vérifier si une commande peut être annulée
    public boolean canOrderBeCancelled(Order order) {
        return order.getStatus() == OrderStatus.PENDING 
            || order.getStatus() == OrderStatus.CONFIRMED;
    }
    
    // Vérifier si une commande peut être confirmée
    public boolean canOrderBeConfirmed(Order order) {
        return order.getStatus() == OrderStatus.PENDING;
    }
    
     public OrderResponseDTO convertToDetailedDTO(Order order) {
        OrderResponseDTO dto = convertToDTO(order);
        
        // Ajouter les items si nécessaire
        // dto.setItems(...);
        
        return dto;
    }
}