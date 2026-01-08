package com.example.backend_darkitchen.dto;

import java.util.List;

public class OrderRequestDTO {
    private ClientInfoDTO clientInfo;
    private List<OrderItemDTO> items;
    private String notes;
    private Double totalAmount;
    
    // Constructeurs
    public OrderRequestDTO() {}
    
    public OrderRequestDTO(ClientInfoDTO clientInfo, List<OrderItemDTO> items, String notes, Double totalAmount) {
        this.clientInfo = clientInfo;
        this.items = items;
        this.notes = notes;
        this.totalAmount = totalAmount;
    }
    
    // Getters & Setters
    public ClientInfoDTO getClientInfo() {
        return clientInfo;
    }
    
    public void setClientInfo(ClientInfoDTO clientInfo) {
        this.clientInfo = clientInfo;
    }
    
    public List<OrderItemDTO> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    @Override
    public String toString() {
        return "OrderRequestDTO{" +
                "clientInfo=" + clientInfo +
                ", items=" + items +
                ", notes='" + notes + '\'' +
                ", totalAmount=" + totalAmount +
                '}';
    }
}