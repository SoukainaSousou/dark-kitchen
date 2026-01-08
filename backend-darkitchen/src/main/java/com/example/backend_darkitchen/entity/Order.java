package com.example.backend_darkitchen.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    @Column(nullable = false)
    private String status = "EN_ATTENTE"; // EN_ATTENTE, EN_PREPARATION, PRET, EN_LIVRAISON, LIVREE, ANNULEE
    
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;
    
    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;
    
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    
    private String notes;
    
    @Column(name = "client_email", nullable = false)
    private String clientEmail;
    
    @Column(name = "client_fullname", nullable = false)
    private String clientFullName;
    
    // Constructeurs
    public Order() {
        this.orderDate = LocalDateTime.now();
    }
    
    public Order(Client client, String deliveryAddress, String phoneNumber) {
        this();
        this.client = client;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        if (client != null) {
            this.clientEmail = client.getEmail();
            this.clientFullName = client.getFullName();
        }
    }
    
    // Méthodes utilitaires
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
    
    public void calculateTotal() {
        this.totalAmount = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }
    
    // Getters & Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Client getClient() {
        return client;
    }
    
    public void setClient(Client client) {
        this.client = client;
        if (client != null) {
            this.clientEmail = client.getEmail();
            this.clientFullName = client.getFullName();
        }
    }
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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

     @Transient
    private Boolean canCancel = false;
    
    // Getters et setters
    public Boolean getCanCancel() {
        return canCancel;
    }
    
    public void setCanCancel(Boolean canCancel) {
        this.canCancel = canCancel;
    }
}