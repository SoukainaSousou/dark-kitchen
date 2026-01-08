package com.example.backend_darkitchen.dto;

public class ClientLoginDTO {
    private String email;
    private String password;
    
    // Constructeurs
    public ClientLoginDTO() {}
    
    public ClientLoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters & Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    @Override
    public String toString() {
        return "ClientLoginDTO{" +
                "email='" + email + '\'' +
                ", password='" + (password != null ? "[PROTECTED]" : "null") + '\'' +
                '}';
    }
}