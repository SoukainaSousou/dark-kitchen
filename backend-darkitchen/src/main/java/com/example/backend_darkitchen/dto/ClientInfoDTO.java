package com.example.backend_darkitchen.dto;

public class ClientInfoDTO {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String deliveryAddress;
    private String password;
    
    // Constructeurs
    public ClientInfoDTO() {}
    
    public ClientInfoDTO(String fullName, String email, String phoneNumber, String deliveryAddress) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.deliveryAddress = deliveryAddress;
    }
    
    public ClientInfoDTO(String fullName, String email, String phoneNumber, String deliveryAddress, String password) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.deliveryAddress = deliveryAddress;
        this.password = password;
    }
    
    // Getters & Setters
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    @Override
    public String toString() {
        return "ClientInfoDTO{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                ", password='" + (password != null ? "[PROTECTED]" : "null") + '\'' +
                '}';
    }
}