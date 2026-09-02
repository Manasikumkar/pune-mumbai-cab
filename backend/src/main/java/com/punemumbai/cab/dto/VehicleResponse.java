package com.punemumbai.cab.dto;

import com.punemumbai.cab.entity.Vehicle;

import java.util.List;

public class VehicleResponse {

    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private String image;
    private String imageAlt;
    private String type;
    private Integer seatingCapacity;
    private Integer luggageCapacity = 2;
    private String description;
    private Double price;
    private Double pricePerKm = 12.0;
    private String currency = "INR";
    private Boolean isPopular = false;
    private String bestFor;
    private List<String> models;
    private List<String> features;
    private String status;

    public VehicleResponse() {}

    public VehicleResponse(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.name = vehicle.getName();
        this.slug = vehicle.getSlug();
        this.imageUrl = vehicle.getImageUrl();
        this.image = vehicle.getImageUrl(); // alias for frontend
        this.seatingCapacity = vehicle.getSeatingCapacity();
        this.description = vehicle.getDescription();
        this.price = vehicle.getPrice();
        this.status = vehicle.getStatus().name();

        // Compute defaults based on vehicle type
        switch (vehicle.getSlug()) {
            case "suv" -> {
                this.type = "SUV / MUV";
                this.models = List.of("Maruti Ertiga", "Kia Carens", "Mahindra Marazzo");
                this.luggageCapacity = 3;
                this.bestFor = "Families of 5–6, weekend luggage";
                this.pricePerKm = 14.0;
                this.isPopular = true;
                this.imageAlt = "White SUV taxi driving on a tree-lined highway";
                this.features = List.of("Air conditioned", "Verified driver", "Extra legroom", "Roof carrier on request", "Sanitised daily");
            }
            case "innova" -> {
                this.type = "MPV";
                this.models = List.of("Toyota Innova");
                this.luggageCapacity = 4;
                this.bestFor = "Groups of 6–7 with lots of luggage";
                this.pricePerKm = 16.0;
                this.imageAlt = "Toyota Innova MPV cab cruising on an expressway";
                this.features = List.of("Air conditioned", "Experienced Innova driver", "Reclining seats", "Ample boot space", "Sanitised daily");
            }
            case "innova-crysta" -> {
                this.type = "Premium MPV";
                this.models = List.of("Toyota Innova Crysta");
                this.luggageCapacity = 4;
                this.bestFor = "Corporate travel, premium airport transfers";
                this.pricePerKm = 18.0;
                this.imageAlt = "Silver Toyota Innova Crysta premium cab";
                this.features = List.of("Dual-zone climate control", "Captain seats", "Chauffeur in uniform", "Complimentary water", "Sanitised daily");
            }
            default -> { // sedan
                this.type = "Sedan";
                this.models = List.of("Swift Dzire", "Honda Amaze", "Toyota Etios", "Hyundai Aura");
                this.luggageCapacity = 2;
                this.bestFor = "Solo travellers, couples, light luggage";
                this.pricePerKm = 11.0;
                this.imageAlt = "White sedan cab parked beside a scenic highway";
                this.features = List.of("Air conditioned", "Verified driver", "Music system", "Phone charging", "Sanitised daily");
            }
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getImageAlt() { return imageAlt; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getSeatingCapacity() { return seatingCapacity; }
    public void setSeatingCapacity(Integer seatingCapacity) { this.seatingCapacity = seatingCapacity; }
    public Integer getLuggageCapacity() { return luggageCapacity; }
    public void setLuggageCapacity(Integer luggageCapacity) { this.luggageCapacity = luggageCapacity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getPricePerKm() { return pricePerKm; }
    public void setPricePerKm(Double pricePerKm) { this.pricePerKm = pricePerKm; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }
    public String getBestFor() { return bestFor; }
    public void setBestFor(String bestFor) { this.bestFor = bestFor; }
    public List<String> getModels() { return models; }
    public void setModels(List<String> models) { this.models = models; }
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
