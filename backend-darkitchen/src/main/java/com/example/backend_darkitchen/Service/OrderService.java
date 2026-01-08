package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.dto.OrderRequestDTO;
import com.example.backend_darkitchen.dto.ClientInfoDTO;
import com.example.backend_darkitchen.dto.OrderResponseDTO;
import com.example.backend_darkitchen.dto.OrderItemResponseDTO;
import com.example.backend_darkitchen.entity.*;
import com.example.backend_darkitchen.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    
    @Transactional
    public Order createOrder(OrderRequestDTO orderRequest) {
        // 1. Gérer l'authentification client
        Client client = handleClientAuthentication(orderRequest.getClientInfo());
        
        // 2. Créer la commande
        Order order = new Order();
        order.setClient(client);
        order.setDeliveryAddress(orderRequest.getClientInfo().getDeliveryAddress());
        order.setPhoneNumber(orderRequest.getClientInfo().getPhoneNumber());
        order.setNotes(orderRequest.getNotes());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setStatus("EN_ATTENTE");
        
        // Sauvegarder la commande d'abord pour avoir un ID
        order = orderRepository.save(order);
        
        // 3. Ajouter les items
        for (var itemDTO : orderRequest.getItems()) {
            Dish dish = dishRepository.findById(itemDTO.getDishId())
                .orElseThrow(() -> new RuntimeException("Plat non trouvé: " + itemDTO.getDishId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemDTO.getPrice());
            orderItem.setDishName(dish.getName());
            
            order.addItem(orderItem);
            orderItemRepository.save(orderItem);
        }
        
        // 4. Recalculer et sauvegarder le total
        order.calculateTotal();
        return orderRepository.save(order);
    }
    
    private Client handleClientAuthentication(ClientInfoDTO clientInfo) {
        // Vérifier si l'email existe déjà
        Optional<Client> existingClient = clientRepository.findByEmail(clientInfo.getEmail());
        
        if (existingClient.isPresent()) {
            // Client existe - le retourner
            return existingClient.get();
        }
        
        // Créer un nouveau client
        Client newClient = new Client();
        String[] names = clientInfo.getFullName().split(" ", 2);
        newClient.setFirstName(names.length > 0 ? names[0] : clientInfo.getFullName());
        newClient.setLastName(names.length > 1 ? names[1] : "");
        newClient.setEmail(clientInfo.getEmail());
        newClient.setPhoneNumber(clientInfo.getPhoneNumber());
        newClient.setAddress(clientInfo.getDeliveryAddress());
        
        // Générer un mot de passe temporaire si non fourni
        String password = clientInfo.getPassword() != null && !clientInfo.getPassword().isEmpty() ? 
            clientInfo.getPassword() : 
            generateTemporaryPassword();
        
        newClient.setPassword(password); // Pas d'encodage pour simplifier
        newClient.setRegistrationDate(LocalDateTime.now());
        newClient.setActive(true);
        
        return clientRepository.save(newClient);
    }
    
    
    public boolean checkClientExists(String email) {
        return clientRepository.findByEmail(email).isPresent();
    }
    
    public Client authenticateClient(String email, String password) {
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent() && client.get().getPassword().equals(password)) {
            return client.get();
        }
        return null;
    }
    
    // NOUVELLE MÉTHODE : Récupérer les commandes d'un client avec DTO
    public List<OrderResponseDTO> getClientOrders(Long clientId, String status, String startDate, String endDate, String sortBy) {
        try {
            // Vérifier si le client existe
            if (!clientRepository.existsById(clientId)) {
                throw new RuntimeException("Client non trouvé avec l'ID: " + clientId);
            }
            
            // Récupérer les commandes
            List<Order> orders;
            if (sortBy != null && sortBy.equals("createdAt_asc")) {
                orders = orderRepository.findByClientIdOrderByOrderDateAsc(clientId);
            } else {
                orders = orderRepository.findByClientIdOrderByOrderDateDesc(clientId);
            }
            
            // Filtrer par statut si spécifié
            if (status != null && !status.isEmpty() && !status.equals("TOUS")) {
                String convertedStatus = convertStatus(status);
                orders = orders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(convertedStatus))
                    .collect(Collectors.toList());
            }
            
            // Convertir les entités en DTO
            List<OrderResponseDTO> orderDTOs = new ArrayList<>();
            for (Order order : orders) {
                OrderResponseDTO dto = convertToOrderResponseDTO(order);
                orderDTOs.add(dto);
            }
            
            // Trier par montant si demandé
            if (sortBy != null) {
                if (sortBy.equals("total_desc")) {
                    orderDTOs.sort((o1, o2) -> o2.getTotalAmount().compareTo(o1.getTotalAmount()));
                } else if (sortBy.equals("total_asc")) {
                    orderDTOs.sort((o1, o2) -> o1.getTotalAmount().compareTo(o2.getTotalAmount()));
                }
            }
            
            return orderDTOs;
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la récupération des commandes: " + e.getMessage(), e);
        }
    }
    
    // NOUVELLE MÉTHODE : Convertir Order en OrderResponseDTO
    private OrderResponseDTO convertToOrderResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        
        dto.setOrderId(order.getId());
        dto.setClientId(order.getClient() != null ? order.getClient().getId() : null);
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderDate(order.getOrderDate());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setNotes(order.getNotes());
        dto.setClientEmail(order.getClientEmail());
        dto.setClientFullName(order.getClientFullName());
        
        // Convertir les items
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            List<OrderItemResponseDTO> itemDTOs = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                OrderItemResponseDTO itemDTO = new OrderItemResponseDTO();
                itemDTO.setDishId(item.getDish() != null ? item.getDish().getId() : null);
                itemDTO.setDishName(item.getDishName());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setPrice(item.getPrice());
                itemDTO.setSubtotal(item.getPrice() * item.getQuantity());
                itemDTOs.add(itemDTO);
            }
            dto.setItems(itemDTOs);
        }
        
        return dto;
    }
    
    // NOUVELLE MÉTHODE : Récupérer une commande par ID avec DTO
    public OrderResponseDTO getOrderById(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + orderId));
            
            return convertToOrderResponseDTO(order);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la récupération de la commande: " + e.getMessage(), e);
        }
    }
    
    // NOUVELLE MÉTHODE : Annuler une commande avec DTO
    @Transactional
    public OrderResponseDTO cancelOrder(Long orderId, String reason) {
        try {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + orderId));
            
            // Vérifier si la commande peut être annulée
            if (!order.getStatus().equals("EN_ATTENTE") && !order.getStatus().equals("EN_PREPARATION")) {
                throw new RuntimeException("Seules les commandes 'EN_ATTENTE' ou 'EN_PREPARATION' peuvent être annulées");
            }
            
            // Annuler la commande
            order.setStatus("ANNULEE");
            
            // Ajouter la raison dans les notes
            if (reason != null && !reason.trim().isEmpty()) {
                String currentNotes = order.getNotes() != null ? order.getNotes() : "";
                order.setNotes(currentNotes + (currentNotes.isEmpty() ? "" : "\n") + 
                              "Annulée le " + LocalDateTime.now() + " - Raison: " + reason);
            }
            
            Order cancelledOrder = orderRepository.save(order);
            return convertToOrderResponseDTO(cancelledOrder);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'annulation de la commande: " + e.getMessage(), e);
        }
    }
    
    // NOUVELLE MÉTHODE : Commander à nouveau avec DTO
    @Transactional
    public OrderResponseDTO reorder(Long orderId) {
        try {
            Order originalOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + orderId));
            
            // Créer une nouvelle commande basée sur l'originale
            Order newOrder = new Order();
            newOrder.setClient(originalOrder.getClient());
            newOrder.setDeliveryAddress(originalOrder.getDeliveryAddress());
            newOrder.setPhoneNumber(originalOrder.getPhoneNumber());
            newOrder.setNotes("Commande recréée à partir de la commande #" + orderId);
            newOrder.setStatus("EN_ATTENTE");
            
            // Copier les items
            for (OrderItem originalItem : originalOrder.getItems()) {
                Dish dish = dishRepository.findById(originalItem.getDish().getId())
                    .orElseThrow(() -> new RuntimeException("Plat non trouvé: " + originalItem.getDish().getId()));
                
                OrderItem newItem = new OrderItem();
                newItem.setDish(dish);
                newItem.setQuantity(originalItem.getQuantity());
                newItem.setPrice(dish.getPrice()); // Utiliser le prix actuel du plat
                newItem.setDishName(dish.getName());
                newOrder.addItem(newItem);
            }
            
            // Calculer le total
            newOrder.calculateTotal();
            
            // Sauvegarder la nouvelle commande
            Order savedOrder = orderRepository.save(newOrder);
            return convertToOrderResponseDTO(savedOrder);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la recréation de la commande: " + e.getMessage(), e);
        }
    }
    
    // Méthode utilitaire pour convertir les statuts
    private String convertStatus(String status) {
        switch (status.toUpperCase()) {
            case "PENDING": return "EN_ATTENTE";
            case "CONFIRMED": return "CONFIRMÉE";
            case "PREPARING": return "EN_PREPARATION";
            case "READY": return "PRÊT";
            case "ON_DELIVERY": return "EN_LIVRAISON";
            case "DELIVERED": return "LIVRÉE";
            case "CANCELLED": return "ANNULEE";
            default: return status;
        }
    }
    
    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}