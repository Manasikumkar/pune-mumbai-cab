package com.punemumbai.cab.controller;

import com.punemumbai.cab.dto.FAQResponse;
import com.punemumbai.cab.service.FAQService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FAQController {

    private final FAQService faqService;

    public FAQController(FAQService faqService) {
        this.faqService = faqService;
    }

    @GetMapping("/faqs")
    public ResponseEntity<Map<String, Object>> getFAQs(
            @RequestParam(required = false) String routeSlug) {
        List<FAQResponse> faqs = faqService.getFAQs(routeSlug);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", faqs,
            "meta", Map.of("total", faqs.size(), "timestamp", Instant.now().toString())
        ));
    }
}
