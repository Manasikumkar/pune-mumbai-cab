package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.EnquiryRequest;
import com.punemumbai.cab.dto.EnquiryResponse;
import com.punemumbai.cab.service.EnquiryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Handles the frontend's booking form submission (POST /bookings).
 * Maps the frontend field names to the backend EnquiryRequest format.
 */
@RestController
@RequestMapping("/api")
public class BookingController {

    private final EnquiryService enquiryService;

    public BookingController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping("/bookings")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> submitBooking(
            @RequestBody Map<String, Object> body,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = httpRequest.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }

        // Map frontend field names to backend EnquiryRequest
        EnquiryRequest request = new EnquiryRequest();
        request.setName((String) body.getOrDefault("name", ""));
        request.setPhone((String) body.getOrDefault("mobile", ""));
        request.setEmail((String) body.getOrDefault("email", null));
        request.setPickupLocation((String) body.getOrDefault("pickup", ""));
        request.setDropLocation((String) body.getOrDefault("drop", ""));

        String travelDateStr = (String) body.getOrDefault("travelDate", null);
        if (travelDateStr != null && !travelDateStr.isBlank()) {
            try {
                request.setTravelDate(java.time.LocalDate.parse(travelDateStr));
            } catch (Exception ignored) {}
        }

        request.setTravelTime((String) body.getOrDefault("travelTime", null));

        String tripType = (String) body.getOrDefault("tripType", "one-way");
        request.setTripType("round-trip".equalsIgnoreCase(tripType) ? "ROUND_TRIP" : "ONE_WAY");
        request.setVehicleId(null);

        Object passengers = body.getOrDefault("passengers", 2);
        if (passengers instanceof Number) {
            request.setPassengers(((Number) passengers).intValue());
        } else {
            try {
                request.setPassengers(Integer.parseInt(String.valueOf(passengers)));
            } catch (Exception e) {
                request.setPassengers(2);
            }
        }

        request.setMessage((String) body.getOrDefault("message", null));

        if (request.getName().isBlank() || request.getPhone().isBlank()) {
            Map<String, Object> errorResp = new LinkedHashMap<>();
            errorResp.put("success", false);
            errorResp.put("message", "Name and mobile are required");
            errorResp.put("meta", Map.of("timestamp", Instant.now().toString()));
            return ResponseEntity.badRequest().body(errorResp);
        }

        enquiryService.submitEnquiry(request, clientIp);

        String reference = "PMC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // Build response using LinkedHashMap (no 10-pair limit)
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("reference", reference);
        data.put("status", "received");
        data.put("name", request.getName());
        data.put("mobile", request.getPhone());
        data.put("email", request.getEmail() != null ? request.getEmail() : "");
        data.put("pickup", request.getPickupLocation());
        data.put("drop", request.getDropLocation());
        data.put("travelDate", request.getTravelDate() != null ? request.getTravelDate().toString() : "");
        data.put("travelTime", request.getTravelTime() != null ? request.getTravelTime() : "");
        data.put("tripType", request.getTripType().toLowerCase().replace("_", "-"));
        data.put("vehicle", body.getOrDefault("vehicle", ""));
        data.put("passengers", request.getPassengers());
        data.put("createdAt", Instant.now().toString());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Booking request received");
        response.put("data", data);
        response.put("meta", Map.of("timestamp", Instant.now().toString()));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
