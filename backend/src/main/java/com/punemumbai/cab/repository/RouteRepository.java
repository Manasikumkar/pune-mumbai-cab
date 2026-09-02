package com.punemumbai.cab.repository;

import com.punemumbai.cab.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    List<Route> findByStatus(Route.Status status);

    Optional<Route> findBySlug(String slug);

    Optional<Route> findBySlugAndStatus(String slug, Route.Status status);
}
