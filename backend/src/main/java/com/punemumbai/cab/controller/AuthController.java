package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.AuthRequest;
import com.punemumbai.cab.dto.AuthResponse;
import com.punemumbai.cab.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse auth = authService.login(request);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Login successful",
            "data", auth,
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }
}
