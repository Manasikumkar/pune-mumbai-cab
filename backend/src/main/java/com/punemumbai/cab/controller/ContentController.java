package com.punemumbai.cab.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Serves static content (testimonials, services, stats) that doesn't live in the database.
 * In production these could be CMS-driven or database-backed; for now they are hardcoded
 * to match what the React frontend expects.
 */
@RestController
@RequestMapping("/api")
public class ContentController {

    @GetMapping("/testimonials")
    public ResponseEntity<Map<String, Object>> getTestimonials(
            @RequestParam(required = false) Integer limit) {

        List<Map<String, Object>> testimonials = List.of(
            Map.of(
                "id", 1, "name", "Rohan Deshmukh", "location", "Hinjewadi, Pune",
                "rating", 5, "tripType", "One Way", "vehicleSlug", "sedan",
                "date", "2026-01-18",
                "text", "Booked a 4 AM pickup from Hinjewadi for a T2 international flight. Driver arrived 10 minutes early, car was spotless and we reached Mumbai Airport in 3 hours flat. Exactly the fixed fare quoted, no surprises."
            ),
            Map.of(
                "id", 2, "name", "Priya Iyer", "location", "Andheri West, Mumbai",
                "rating", 5, "tripType", "Round Trip", "vehicleSlug", "innova-crysta",
                "date", "2026-02-02",
                "text", "I travel to our Magarpatta office twice a month and have used Pune Mumbai Cab for over a year. The Innova Crysta is always on time at T1 and the GST invoice lands in my inbox the same evening. Effortless."
            ),
            Map.of(
                "id", 3, "name", "Amit Kulkarni", "location", "Kothrud, Pune",
                "rating", 5, "tripType", "Round Trip", "vehicleSlug", "suv",
                "date", "2025-12-14",
                "text", "Took my parents and kids to Mumbai for a wedding in the SUV. Plenty of room for six of us plus bags, and the driver was patient with our Lonavala chikki stop. Highly recommended for families."
            ),
            Map.of(
                "id", 4, "name", "Sneha Patil", "location", "Thane West",
                "rating", 4, "tripType", "One Way", "vehicleSlug", "sedan",
                "date", "2026-01-30",
                "text", "Smooth ride from Thane to Baner on a Friday evening. There was traffic near Khopoli but the driver kept us updated and took the alternate exit. Fair price and a very courteous driver."
            ),
            Map.of(
                "id", 5, "name", "Karan Mehta", "location", "Powai, Mumbai",
                "rating", 5, "tripType", "One Way", "vehicleSlug", "innova",
                "date", "2025-11-22",
                "text", "Our startup uses them for all Mumbai–Pune client visits. Clean cars, professional drivers who don't over-speed on the ghats, and one consolidated monthly bill. What more can you ask for?"
            ),
            Map.of(
                "id", 6, "name", "Neha Joshi", "location", "Baner, Pune",
                "rating", 5, "tripType", "One Way", "vehicleSlug", "sedan",
                "date", "2026-02-11",
                "text", "Booked for my mother travelling alone to Dadar. They shared the driver's details with both of us and I could track the trip live on WhatsApp. She felt completely safe. Thank you!"
            )
        );

        List<Map<String, Object>> result = limit != null && limit > 0
            ? testimonials.subList(0, Math.min(limit, testimonials.size()))
            : testimonials;

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", result,
            "meta", Map.of("total", result.size(), "timestamp", Instant.now().toString())
        ));
    }

    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getServices() {
        List<Map<String, Object>> services = List.of(
            Map.of(
                "id", 1, "slug", "pune-to-mumbai",
                "name", "Pune → Mumbai Cab",
                "description", "Doorstep pickup anywhere in Pune with a fixed-fare drop across Mumbai, Navi Mumbai or Thane.",
                "icon", "route", "href", "/pune-to-mumbai-cab", "startingPrice", 2499
            ),
            Map.of(
                "id", 2, "slug", "mumbai-to-pune",
                "name", "Mumbai → Pune Cab",
                "description", "Airport, hotel or home pickup in Mumbai with a comfortable Expressway ride to any Pune address.",
                "icon", "route-reverse", "href", "/mumbai-to-pune-cab", "startingPrice", 2499
            ),
            Map.of(
                "id", 3, "slug", "one-way",
                "name", "One Way Drop",
                "description", "Pay only for the direction you travel — no return fare, no per-km surprises, tolls included.",
                "icon", "one-way", "href", "/fleet", "startingPrice", 2499
            ),
            Map.of(
                "id", 4, "slug", "round-trip",
                "name", "Round Trip",
                "description", "Same cab and driver for your same-day meeting or weekend trip. Up to 8 hours of local use included.",
                "icon", "round-trip", "href", "/contact", "startingPrice", 4599
            ),
            Map.of(
                "id", 5, "slug", "airport-transfer",
                "name", "Airport Transfer",
                "description", "Flight-tracked pickups and drops at Mumbai T1, T2, Navi Mumbai Airport and Pune Airport.",
                "icon", "plane", "href", "/mumbai-to-pune-cab#airport", "startingPrice", 2499
            )
        );

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", services,
            "meta", Map.of("total", services.size(), "timestamp", Instant.now().toString())
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCompanyStats() {
        List<Map<String, Object>> stats = List.of(
            Map.of("id", 1, "label", "Trips completed", "value", "25,000+"),
            Map.of("id", 2, "label", "Average rating", "value", "4.8 / 5"),
            Map.of("id", 3, "label", "Years on the Expressway", "value", "12+"),
            Map.of("id", 4, "label", "On-time pickups", "value", "99.2%")
        );

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", stats,
            "meta", Map.of("timestamp", Instant.now().toString())
        ));
    }
}
