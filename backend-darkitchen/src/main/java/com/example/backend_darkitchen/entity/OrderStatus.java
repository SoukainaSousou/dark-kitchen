package com.example.backend_darkitchen.entity;

public enum OrderStatus {
    PENDING("En attente"),
    CONFIRMED("Confirmée"),
    PREPARING("En préparation"),
    READY("Prête"),
    ON_DELIVERY("En livraison"),
    DELIVERED("Livrée"),
    CANCELLED("Annulée");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}