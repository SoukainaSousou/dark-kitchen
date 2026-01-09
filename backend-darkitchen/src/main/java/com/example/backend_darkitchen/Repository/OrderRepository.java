package com.example.backend_darkitchen.Repository;

import com.example.backend_darkitchen.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Méthodes existantes
    List<Order> findByClientId(Long clientId);
    
    // Nouvelle méthode: tri descendant par date
    List<Order> findByClientIdOrderByOrderDateDesc(Long clientId);
    
    // Nouvelle méthode: tri ascendant par date
    List<Order> findByClientIdOrderByOrderDateAsc(Long clientId);
    
    // Recherche par client et statut
    List<Order> findByClientIdAndStatus(Long clientId, String status);
    
    // Compter les commandes par client
    Long countByClientId(Long clientId);

      List<Order> findAllByOrderByOrderDateDesc();
    
    // Commandes par statut
    List<Order> findByStatusOrderByOrderDateDesc(String status);
    
    // Méthode pour trouver par statuts multiples
    List<Order> findByStatusInOrderByOrderDateDesc(List<String> statuses);
}