package com.punemumbai.cab.service;

import com.punemumbai.cab.dto.EnquiryRequest;
import com.punemumbai.cab.dto.EnquiryResponse;
import com.punemumbai.cab.entity.Enquiry;
import com.punemumbai.cab.entity.Vehicle;
import com.punemumbai.cab.exception.ResourceNotFoundException;
import com.punemumbai.cab.repository.EnquiryRepository;
import com.punemumbai.cab.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnquiryService {

    private static final Logger logger = LoggerFactory.getLogger(EnquiryService.class);

    private final EnquiryRepository enquiryRepository;
    private final VehicleRepository vehicleRepository;

    // Simple in-memory rate limiter: IP -> last submission timestamp
    // Production should use Redis or a proper rate-limiting library
    private final Map<String, Long> lastSubmissionTime = new ConcurrentHashMap<>();
    private static final long RATE_LIMIT_MS = 30_000; // 30 seconds between submissions

    public EnquiryService(EnquiryRepository enquiryRepository, VehicleRepository vehicleRepository) {
        this.enquiryRepository = enquiryRepository;
        this.vehicleRepository = vehicleRepository;
    }

    /**
     * Submit a booking enquiry (public endpoint).
     * Simple rate limiting: max 1 submission per IP per 30 seconds.
     */
    public EnquiryResponse submitEnquiry(EnquiryRequest request, String clientIp) {
        // Rate limiting check
        Long lastTime = lastSubmissionTime.get(clientIp);
        long now = System.currentTimeMillis();
        if (lastTime != null && (now - lastTime) < RATE_LIMIT_MS) {
            logger.warn("Rate limit exceeded for IP: {}", clientIp);
            throw new IllegalArgumentException(
                    "Please wait a moment before submitting another enquiry.");
        }
        lastSubmissionTime.put(clientIp, now);

        // Sanitize: trim all string fields
        Enquiry enquiry = new Enquiry();
        enquiry.setName(sanitize(request.getName()));
        enquiry.setPhone(sanitize(request.getPhone()));
        enquiry.setEmail(sanitize(request.getEmail()));
        enquiry.setPickupLocation(sanitize(request.getPickupLocation()));
        enquiry.setDropLocation(sanitize(request.getDropLocation()));
        enquiry.setTravelDate(request.getTravelDate());
        enquiry.setTravelTime(request.getTravelTime());
        enquiry.setTripType(Enquiry.TripType.valueOf(request.getTripType()));
        enquiry.setPassengers(request.getPassengers());
        enquiry.setMessage(sanitize(request.getMessage()));
        enquiry.setStatus(Enquiry.EnquiryStatus.NEW);

        // Link vehicle if provided
        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId()));
            enquiry.setVehicle(vehicle);
        }

        Enquiry saved = enquiryRepository.save(enquiry);
        logger.info("New enquiry submitted: id={}, name={}", saved.getId(), saved.getName());
        return new EnquiryResponse(saved);
    }

    // ---- Admin API ----

    public List<EnquiryResponse> getAllEnquiries() {
        return enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(EnquiryResponse::new)
                .collect(Collectors.toList());
    }

    public List<EnquiryResponse> getEnquiriesByStatus(String status) {
        Enquiry.EnquiryStatus enquiryStatus = Enquiry.EnquiryStatus.valueOf(status);
        return enquiryRepository.findByStatus(enquiryStatus)
                .stream()
                .map(EnquiryResponse::new)
                .collect(Collectors.toList());
    }

    public EnquiryResponse updateEnquiryStatus(Long id, String newStatus) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry", "id", id));
        Enquiry.EnquiryStatus status = Enquiry.EnquiryStatus.valueOf(newStatus);
        enquiry.setStatus(status);
        Enquiry saved = enquiryRepository.save(enquiry);
        return new EnquiryResponse(saved);
    }

    private String sanitize(String input) {
        if (input == null) return null;
        // Trim whitespace and remove potential script tags (basic XSS prevention)
        return input.trim()
                .replaceAll("<[^>]*>", "")
                .replaceAll("javascript:", "")
                .replaceAll("on\\w+=", "");
    }
}
