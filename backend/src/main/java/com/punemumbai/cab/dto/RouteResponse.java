package com.punemumbai.cab.dto;

import com.punemumbai.cab.entity.Route;

import java.util.List;
import java.util.Map;

public class RouteResponse {

    private Long id;
    private String name;
    private String slug;
    private String origin;
    private String destination;
    private Double distanceKm;
    private String distanceUnit = "km";
    private String travelTime;
    private Integer travelTimeMinutes = 195;
    private Double oneWayPrice;
    private Double roundTripPrice;
    private String currency = "INR";
    private Double tollAmount = 336.0;
    private String shortDescription;
    private String description;
    private String image;
    private String imageAlt;
    private String status;
    private List<Map<String, Object>> pricing;
    private List<Map<String, String>> highlights;
    private List<String> inclusions;
    private List<String> exclusions;
    private List<Map<String, Object>> surcharges;
    private List<String> pickupPoints;
    private List<String> dropPoints;
    private Map<String, Object> airport;

    public RouteResponse() {}

    public RouteResponse(Route route) {
        this.id = route.getId();
        this.name = route.getName();
        this.slug = route.getSlug();
        this.origin = route.getOrigin();
        this.destination = route.getDestination();
        this.distanceKm = route.getDistanceKm();
        this.travelTime = route.getTravelTime();
        this.oneWayPrice = route.getOneWayPrice();
        this.roundTripPrice = route.getRoundTripPrice();
        this.description = route.getDescription();
        this.status = route.getStatus().name();
        this.shortDescription = route.getDescription() != null && route.getDescription().length() > 120
            ? route.getDescription().substring(0, 120) + "..."
            : route.getDescription();

        // Pexels images per route
        if ("pune-to-mumbai-cab".equals(route.getSlug())) {
            this.image = "https://images.pexels.com/photos/33898148/pexels-photo-33898148.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800";
            this.imageAlt = "Mumbai–Pune Expressway winding through misty Sahyadri hills";
        } else {
            this.image = "https://images.pexels.com/photos/33350001/pexels-photo-33350001.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800";
            this.imageAlt = "Bandra–Worli Sea Link and Mumbai skyline";
        }

        // Compute per-vehicle pricing from base prices
        this.pricing = List.of(
            Map.of("vehicleSlug", "sedan", "oneWayPrice", route.getOneWayPrice(), "roundTripPrice", route.getRoundTripPrice()),
            Map.of("vehicleSlug", "suv", "oneWayPrice", route.getOneWayPrice() + 800, "roundTripPrice", route.getRoundTripPrice() + 1400),
            Map.of("vehicleSlug", "innova", "oneWayPrice", route.getOneWayPrice() + 1200, "roundTripPrice", route.getRoundTripPrice() + 2200),
            Map.of("vehicleSlug", "innova-crysta", "oneWayPrice", route.getOneWayPrice() + 1800, "roundTripPrice", route.getRoundTripPrice() + 3300)
        );

        // Route highlights
        boolean isPuneToMumbai = "pune-to-mumbai-cab".equals(route.getSlug());
        this.highlights = isPuneToMumbai
            ? List.of(
                Map.of("label", "Expressway", "value", "Yashwantrao Chavan Expressway (94.5 km)"),
                Map.of("label", "Ghat section", "value", "Khandala–Khopoli (Bhor Ghat)"),
                Map.of("label", "Break stop", "value", "Food Mall, Khalapur"),
                Map.of("label", "Mumbai entry", "value", "Sion–Panvel Hwy / Eastern Freeway")
            )
            : List.of(
                Map.of("label", "Airport pickup", "value", "T1, T2 & NMIA with meet-and-greet"),
                Map.of("label", "Mumbai exit", "value", "Eastern Freeway → Kalamboli"),
                Map.of("label", "Ghat section", "value", "Khopoli–Khandala climb"),
                Map.of("label", "Pune entry", "value", "Wakad / Hinjewadi / Chandni Chowk")
            );

        // Inclusions / exclusions
        this.inclusions = List.of(
            "Expressway & NH-48 tolls",
            "Driver allowance",
            "Fuel and state taxes",
            "Doorstep pickup/drop",
            "One short refreshment stop"
        );
        this.exclusions = List.of(
            "5% GST",
            "Parking at destination (if any)",
            "Waiting beyond 45 minutes"
        );

        // Surcharges
        this.surcharges = List.of(
            Map.of("label", "Night pickup (11 PM – 5 AM)", "amount", 300),
            Map.of("label", "Extra stop en route", "amount", 200)
        );

        // Pickup/drop points
        this.pickupPoints = isPuneToMumbai
            ? List.of("Hinjewadi", "Wakad, Baner", "Aundh & Pashan", "Kothrud", "Shivajinagar & Camp", "Pune Railway Station", "Hadapsar & Magarpatta", "Kharadi & Viman Nagar", "Pune Airport (PNQ)", "Pimpri-Chinchwad")
            : List.of("Mumbai Airport T1 & T2", "Navi Mumbai Airport", "Andheri & Powai", "Bandra & BKC", "Dadar & Sion", "Lower Parel & Worli", "South Mumbai", "Thane & Mulund", "Navi Mumbai", "Borivali & Malad");
        this.dropPoints = isPuneToMumbai
            ? List.of("Mumbai Airport T1 & T2", "Navi Mumbai", "Thane & Mulund", "Powai & Andheri", "Bandra & BKC", "Dadar & Sion", "Lower Parel & Worli", "South Mumbai", "Borivali & Malad")
            : List.of("Hinjewadi IT Park", "Wakad & Baner", "Aundh & Pashan", "Kothrud", "Shivajinagar & Camp", "Kharadi & Viman Nagar", "Hadapsar & Magarpatta", "Pimpri-Chinchwad", "Pune Railway Station");

        // Airport info
        this.airport = Map.of(
            "code", "BOM",
            "name", "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
            "terminals", List.of("Terminal 1 (Santacruz)", "Terminal 2 (Sahar)"),
            "note", "We recommend leaving at least 5.5 hours before a domestic departure."
        );
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getDistanceUnit() { return distanceUnit; }
    public void setDistanceUnit(String distanceUnit) { this.distanceUnit = distanceUnit; }
    public String getTravelTime() { return travelTime; }
    public void setTravelTime(String travelTime) { this.travelTime = travelTime; }
    public Integer getTravelTimeMinutes() { return travelTimeMinutes; }
    public void setTravelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; }
    public Double getOneWayPrice() { return oneWayPrice; }
    public void setOneWayPrice(Double oneWayPrice) { this.oneWayPrice = oneWayPrice; }
    public Double getRoundTripPrice() { return roundTripPrice; }
    public void setRoundTripPrice(Double roundTripPrice) { this.roundTripPrice = roundTripPrice; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Double getTollAmount() { return tollAmount; }
    public void setTollAmount(Double tollAmount) { this.tollAmount = tollAmount; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getImageAlt() { return imageAlt; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<Map<String, Object>> getPricing() { return pricing; }
    public void setPricing(List<Map<String, Object>> pricing) { this.pricing = pricing; }
    public List<Map<String, String>> getHighlights() { return highlights; }
    public void setHighlights(List<Map<String, String>> highlights) { this.highlights = highlights; }
    public List<String> getInclusions() { return inclusions; }
    public void setInclusions(List<String> inclusions) { this.inclusions = inclusions; }
    public List<String> getExclusions() { return exclusions; }
    public void setExclusions(List<String> exclusions) { this.exclusions = exclusions; }
    public List<Map<String, Object>> getSurcharges() { return surcharges; }
    public void setSurcharges(List<Map<String, Object>> surcharges) { this.surcharges = surcharges; }
    public List<String> getPickupPoints() { return pickupPoints; }
    public void setPickupPoints(List<String> pickupPoints) { this.pickupPoints = pickupPoints; }
    public List<String> getDropPoints() { return dropPoints; }
    public void setDropPoints(List<String> dropPoints) { this.dropPoints = dropPoints; }
    public Map<String, Object> getAirport() { return airport; }
    public void setAirport(Map<String, Object> airport) { this.airport = airport; }
}
