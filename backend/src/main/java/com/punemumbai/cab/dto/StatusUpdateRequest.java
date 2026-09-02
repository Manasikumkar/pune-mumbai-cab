package com.punemumbai.cab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(NEW|CONTACTED|CONFIRMED|CLOSED)$",
             message = "Status must be one of: NEW, CONTACTED, CONFIRMED, CLOSED")
    private String status;

    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
