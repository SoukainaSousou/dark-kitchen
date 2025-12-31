package com.example.backend_darkitchen.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "dish")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    private double price;

    private String image;

    @ManyToOne(fetch = FetchType.EAGER) // Utiliser EAGER pour éviter les problèmes Lazy
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"dishes", "hibernateLazyInitializer", "handler"})
    private Category category;

    private double rating;

    private String prepTime;

    @Column(name = "is_popular")
    private boolean popular;

    @Column(name = "is_new")
    private boolean newDish; // Renommer la variable

    // Constructeur par défaut
    public Dish() {}

    // Constructeur avec paramètres
    public Dish(String name, String description, double price, String image, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
    }

    // Getters & Setters CORRIGÉS
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }

    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }

    public double getPrice() { 
        return price; 
    }
    
    public void setPrice(double price) { 
        this.price = price; 
    }

    public String getImage() { 
        return image; 
    }
    
    public void setImage(String image) { 
        this.image = image; 
    }

    public Category getCategory() { 
        return category; 
    }
    
    public void setCategory(Category category) { 
        this.category = category; 
    }

    public double getRating() { 
        return rating; 
    }
    
    public void setRating(double rating) { 
        this.rating = rating; 
    }

    public String getPrepTime() { 
        return prepTime; 
    }
    
    public void setPrepTime(String prepTime) { 
        this.prepTime = prepTime; 
    }

    // CORRECTION IMPORTANTE : getIsPopular() au lieu de isPopular()
    public boolean getIsPopular() { 
        return popular; 
    }
    
    public void setIsPopular(boolean popular) { 
        this.popular = popular; 
    }

    // CORRECTION IMPORTANTE : getIsNew() au lieu de isNewDish()
    public boolean getIsNew() { 
        return newDish; 
    }
    
    public void setIsNew(boolean newDish) { 
        this.newDish = newDish; 
    }

    @Override
    public String toString() {
        return "Dish{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", category=" + (category != null ? category.getName() : "null") +
                '}';
    }
}