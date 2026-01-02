package com.example.backend_darkitchen.dto;

public class OrderRequestDTO {
    private Long dishId;
    private ClientInfoDTO clientInfo;
    private String specialInstructions;
    private Integer quantity = 1;
    
    // Getters & Setters
    public Long getDishId() { return dishId; }
    public void setDishId(Long dishId) { this.dishId = dishId; }
    
    public ClientInfoDTO getClientInfo() { return clientInfo; }
    public void setClientInfo(ClientInfoDTO clientInfo) { this.clientInfo = clientInfo; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
