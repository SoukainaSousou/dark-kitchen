package com.example.backend_darkitchen.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double price; // Prix au moment de la commande
    
    @Column(name = "dish_name", nullable = false)
    private String dishName;
    
    // Constructeurs
    public OrderItem() {}
    
    public OrderItem(Dish dish, Integer quantity) {
        this.dish = dish;
        this.quantity = quantity;
        this.price = dish.getPrice();
        this.dishName = dish.getName();
    }
    
    // Getters & Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public Dish getDish() {
        return dish;
    }
    
    public void setDish(Dish dish) {
        this.dish = dish;
        this.dishName = dish.getName();
        this.price = dish.getPrice();
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getDishName() {
        return dishName;
    }
    
    public void setDishName(String dishName) {
        this.dishName = dishName;
    }
    
    // Méthode utilitaire
    public Double getSubtotal() {
        return price * quantity;
    }
}