package com.example.backend_darkitchen.dto;

public class OrderItemDTO {
    private Long dishId;
    private Integer quantity;
    private Double price;
    
    // Constructeurs
    public OrderItemDTO() {}
    
    public OrderItemDTO(Long dishId, Integer quantity, Double price) {
        this.dishId = dishId;
        this.quantity = quantity;
        this.price = price;
    }
    
    // Getters & Setters
    public Long getDishId() {
        return dishId;
    }
    
    public void setDishId(Long dishId) {
        this.dishId = dishId;
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
    
    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "dishId=" + dishId +
                ", quantity=" + quantity +
                ", price=" + price +
                '}';
    }
}