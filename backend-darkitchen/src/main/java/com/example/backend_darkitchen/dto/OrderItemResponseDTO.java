package com.example.backend_darkitchen.dto;

public class OrderItemResponseDTO {
    private Long dishId;
    private String dishName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
    
    // Constructeurs
    public OrderItemResponseDTO() {}
    
    public OrderItemResponseDTO(Long dishId, String dishName, Integer quantity, Double price) {
        this.dishId = dishId;
        this.dishName = dishName;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = price * quantity;
    }
    
    // Getters & Setters
    public Long getDishId() {
        return dishId;
    }
    
    public void setDishId(Long dishId) {
        this.dishId = dishId;
    }
    
    public String getDishName() {
        return dishName;
    }
    
    public void setDishName(String dishName) {
        this.dishName = dishName;
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
    
    public Double getSubtotal() {
        return subtotal != null ? subtotal : price * quantity;
    }
    
    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}