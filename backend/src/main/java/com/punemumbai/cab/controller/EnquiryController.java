package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.*;
import com.punemumbai.cab.service.EnquiryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    // ===== PUBLIC API (no auth) =====

    /**
     * Submit a booking enquiry.
     * Rate limited: max 1 submission per IP per 30 seconds.
     */
    @PostMapping("/enquiries")
    public ResponseEntity<Map<String, Object>> submitEnquiry(
            @Valid @RequestBody EnquiryRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = httpRequest.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }

        EnquiryResponse enquiry = enquiryService.submitEnquiry(request, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "message", "Enquiry submitted successfully",
                    "data", enquiry,
                    "meta", Map.of("timestamp", Instant.now().toString())
                ));
    }

    // ===== ADMIN APIs (JWT-protected) =====

    @GetMapping("/admin/enquiries")
    public ResponseEntity<Map<String, Object>> getEnquiries(
            @RequestParam(required = false) String status) {
        List<EnquiryResponse> enquiries;
        if (status != null && !status.isBlank()) {
            enquiries = enquiryService.getEnquiriesByStatus(status);
        } else {
            enquiries = enquiryService.getAllEnquiries();
        }
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", enquiries,
            "meta", Map.of("total", enquiries.size(), "timestamp", Instant.now().toString())
        ));
    }

    @PutMapping("/admin/enquiries/{id}/status")
    public ResponseEntity<Map<String, Object>> updateEnquiryStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        EnquiryResponse enquiry = enquiryService.updateEnquiryStatus(id, request.getStatus());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Enquiry status updated",
            "data", enquiry,
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }
}
