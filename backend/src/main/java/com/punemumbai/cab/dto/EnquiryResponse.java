package com.punemumbai.cab.dto;

import com.punemumbai.cab.entity.Enquiry;
import java.time.LocalDateTime;

public class EnquiryResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String pickupLocation;
    private String dropLocation;
    private String travelDate;
    private String travelTime;
    private String tripType;
    private Long vehicleId;
    private String vehicleName;
    private Integer passengers;
    private String message;
    private String status;
    private String createdAt;

    public EnquiryResponse() {}

    public EnquiryResponse(Enquiry enquiry) {
        this.id = enquiry.getId();
        this.name = enquiry.getName();
        this.phone = enquiry.getPhone();
        this.email = enquiry.getEmail();
        this.pickupLocation = enquiry.getPickupLocation();
        this.dropLocation = enquiry.getDropLocation();
        this.travelDate = enquiry.getTravelDate() != null ? enquiry.getTravelDate().toString() : null;
        this.travelTime = enquiry.getTravelTime();
        this.tripType = enquiry.getTripType().name();
        this.vehicleId = enquiry.getVehicle() != null ? enquiry.getVehicle().getId() : null;
        this.vehicleName = enquiry.getVehicle() != null ? enquiry.getVehicle().getName() : null;
        this.passengers = enquiry.getPassengers();
        this.message = enquiry.getMessage();
        this.status = enquiry.getStatus().name();
        this.createdAt = enquiry.getCreatedAt() != null ? enquiry.getCreatedAt().toString() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }

    public String getTravelDate() { return travelDate; }
    public void setTravelDate(String travelDate) { this.travelDate = travelDate; }

    public String getTravelTime() { return travelTime; }
    public void setTravelTime(String travelTime) { this.travelTime = travelTime; }

    public String getTripType() { return tripType; }
    public void setTripType(String tripType) { this.tripType = tripType; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }

    public Integer getPassengers() { return passengers; }
    public void setPassengers(Integer passengers) { this.passengers = passengers; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
