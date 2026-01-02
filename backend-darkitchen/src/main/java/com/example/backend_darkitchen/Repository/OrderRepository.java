package com.example.backend_darkitchen.Repository;

import com.example.backend_darkitchen.entity.Order;
import com.example.backend_darkitchen.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByClientOrderByOrderDateDesc(Client client);
    List<Order> findByStatus(String status);
}