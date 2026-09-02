package com.punemumbai.cab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RouteRequest {

    @NotBlank(message = "Route name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    private Double distanceKm;
    private String travelTime;

    @NotNull(message = "One-way price is required")
    @Positive(message = "One-way price must be positive")
    private Double oneWayPrice;

    @NotNull(message = "Round-trip price is required")
    @Positive(message = "Round-trip price must be positive")
    private Double roundTripPrice;

    private String description;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getTravelTime() { return travelTime; }
    public void setTravelTime(String travelTime) { this.travelTime = travelTime; }

    public Double getOneWayPrice() { return oneWayPrice; }
    public void setOneWayPrice(Double oneWayPrice) { this.oneWayPrice = oneWayPrice; }

    public Double getRoundTripPrice() { return roundTripPrice; }
    public void setRoundTripPrice(Double roundTripPrice) { this.roundTripPrice = roundTripPrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
