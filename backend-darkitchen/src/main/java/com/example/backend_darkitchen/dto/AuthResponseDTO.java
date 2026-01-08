package com.example.backend_darkitchen.dto;

public class AuthResponseDTO {
    private boolean success;
    private String message;
    private ClientDTO client;
    private String token;
    
    // Constructeurs
    public AuthResponseDTO() {}
    
    public AuthResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponseDTO(boolean success, String message, ClientDTO client) {
        this.success = success;
        this.message = message;
        this.client = client;
    }
    
    // Getters & Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public ClientDTO getClient() {
        return client;
    }
    
    public void setClient(ClientDTO client) {
        this.client = client;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}