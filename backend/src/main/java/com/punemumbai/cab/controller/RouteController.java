package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.ApiResponse;
import com.punemumbai.cab.dto.RouteRequest;
import com.punemumbai.cab.dto.RouteResponse;
import com.punemumbai.cab.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // ===== PUBLIC APIs (no auth) =====

    @GetMapping("/routes")
    public ResponseEntity<Map<String, Object>> getActiveRoutes() {
        List<RouteResponse> routes = routeService.getActiveRoutes();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", routes,
            "meta", Map.of("total", routes.size(), "timestamp", Instant.now().toString())
        ));
    }

    @GetMapping("/routes/{slug}")
    public ResponseEntity<Map<String, Object>> getActiveRouteBySlug(@PathVariable String slug) {
        RouteResponse route = routeService.getActiveRouteBySlug(slug);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", route,
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }

    // ===== ADMIN APIs (JWT-protected) =====

    @GetMapping("/admin/routes")
    public ResponseEntity<Map<String, Object>> getAllRoutes() {
        List<RouteResponse> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", routes,
            "meta", Map.of("total", routes.size(), "timestamp", Instant.now().toString())
        ));
    }

    @PostMapping("/admin/routes")
    public ResponseEntity<Map<String, Object>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse route = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "message", "Route created successfully",
                    "data", route,
                    "meta", Map.of("timestamp", Instant.now().toString())
                ));
    }

    @PutMapping("/admin/routes/{id}")
    public ResponseEntity<Map<String, Object>> updateRoute(@PathVariable Long id,
                                                   @Valid @RequestBody RouteRequest request) {
        RouteResponse route = routeService.updateRoute(id, request);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Route updated successfully",
            "data", route,
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }

    @DeleteMapping("/admin/routes/{id}")
    public ResponseEntity<Map<String, Object>> deactivateRoute(@PathVariable Long id) {
        routeService.deactivateRoute(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Route deactivated successfully",
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }
}
