package com.example.backend_darkitchen.entity;

public enum PaymentStatus {
    PENDING("En attente"),
    PAID("Payée"),
    FAILED("Échouée"),
    REFUNDED("Remboursée");

    private final String displayName;

    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}