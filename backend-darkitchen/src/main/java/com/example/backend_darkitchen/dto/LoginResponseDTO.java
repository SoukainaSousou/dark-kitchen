package com.example.backend_darkitchen.dto;

public class LoginResponseDTO {
    private String token;
    private ClientDTO client;
    
    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public ClientDTO getClient() { return client; }
    public void setClient(ClientDTO client) { this.client = client; }
}