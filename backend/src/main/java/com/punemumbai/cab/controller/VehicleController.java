package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.ApiResponse;
import com.punemumbai.cab.dto.VehicleRequest;
import com.punemumbai.cab.dto.VehicleResponse;
import com.punemumbai.cab.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // ===== PUBLIC APIs (no auth) =====

    @GetMapping("/vehicles")
    public ResponseEntity<Map<String, Object>> getActiveVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getActiveVehicles();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", vehicles,
            "meta", Map.of("total", vehicles.size(), "timestamp", java.time.Instant.now().toString())
        ));
    }

    @GetMapping("/vehicles/{slug}")
    public ResponseEntity<Map<String, Object>> getActiveVehicleBySlug(@PathVariable String slug) {
        VehicleResponse vehicle = vehicleService.getActiveVehicleBySlug(slug);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", vehicle,
            "meta", Map.of("timestamp", java.time.Instant.now().toString())
        ));
    }

    // ===== ADMIN APIs (JWT-protected) =====

    @GetMapping("/admin/vehicles")
    public ResponseEntity<Map<String, Object>> getAllVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", vehicles,
            "meta", Map.of("total", vehicles.size(), "timestamp", java.time.Instant.now().toString())
        ));
    }

    @PostMapping("/admin/vehicles")
    public ResponseEntity<Map<String, Object>> createVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse vehicle = vehicleService.createVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "message", "Vehicle created successfully",
                    "data", vehicle,
                    "meta", Map.of("timestamp", java.time.Instant.now().toString())
                ));
    }

    @PutMapping("/admin/vehicles/{id}")
    public ResponseEntity<Map<String, Object>> updateVehicle(@PathVariable Long id,
                                                     @Valid @RequestBody VehicleRequest request) {
        VehicleResponse vehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Vehicle updated successfully",
            "data", vehicle,
            "meta", Map.of("timestamp", java.time.Instant.now().toString())
        ));
    }

    @DeleteMapping("/admin/vehicles/{id}")
    public ResponseEntity<Map<String, Object>> deactivateVehicle(@PathVariable Long id) {
        vehicleService.deactivateVehicle(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Vehicle deactivated successfully",
            "meta", Map.of("timestamp", java.time.Instant.now().toString())
        ));
    }
}
