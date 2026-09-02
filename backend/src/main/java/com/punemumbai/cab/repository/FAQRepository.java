package com.punemumbai.cab.repository;

import com.punemumbai.cab.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {

    List<FAQ> findByRouteSlugIsNull();

    List<FAQ> findByRouteSlug(String routeSlug);
}
