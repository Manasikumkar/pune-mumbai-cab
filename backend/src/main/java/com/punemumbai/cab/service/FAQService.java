package com.punemumbai.cab.service;

import com.punemumbai.cab.dto.FAQResponse;
import com.punemumbai.cab.entity.FAQ;
import com.punemumbai.cab.repository.FAQRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FAQService {

    private final FAQRepository faqRepository;

    public FAQService(FAQRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    /**
     * Get FAQs: general (routeSlug=null) + route-specific ones.
     * If routeSlug is provided, return general + specific FAQs for that route.
     */
    public List<FAQResponse> getFAQs(String routeSlug) {
        List<FAQ> faqs = new ArrayList<>();

        // Always include general FAQs (routeSlug is null)
        faqs.addAll(faqRepository.findByRouteSlugIsNull());

        // If a specific route slug is provided, also include its FAQs
        if (routeSlug != null && !routeSlug.isBlank()) {
            faqs.addAll(faqRepository.findByRouteSlug(routeSlug));
        }

        return faqs.stream()
                .map(FAQResponse::new)
                .collect(Collectors.toList());
    }
}
