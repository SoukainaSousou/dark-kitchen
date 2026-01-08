package com.example.backend_darkitchen.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long orderId;
    private Long clientId;
    private String status;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private String deliveryAddress;
    private String phoneNumber;
    private String notes;
    private String clientEmail;
    private String clientFullName;
    private List<OrderItemResponseDTO> items;
    private String message;
    
    // Constructeurs
    public OrderResponseDTO() {}
    
    public OrderResponseDTO(Long orderId, Long clientId, String status, Double totalAmount, 
                           String clientEmail, String clientFullName) {
        this.orderId = orderId;
        this.clientId = clientId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.clientEmail = clientEmail;
        this.clientFullName = clientFullName;
        this.orderDate = LocalDateTime.now();
    }
    
    // Getters & Setters
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public Long getClientId() {
        return clientId;
    }
    
    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
    
    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getClientEmail() {
        return clientEmail;
    }
    
    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }
    
    public String getClientFullName() {
        return clientFullName;
    }
    
    public void setClientFullName(String clientFullName) {
        this.clientFullName = clientFullName;
    }
    
    public List<OrderItemResponseDTO> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemResponseDTO> items) {
        this.items = items;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}