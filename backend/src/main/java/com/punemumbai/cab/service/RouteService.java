package com.punemumbai.cab.service;

import com.punemumbai.cab.dto.RouteRequest;
import com.punemumbai.cab.dto.RouteResponse;
import com.punemumbai.cab.entity.Route;
import com.punemumbai.cab.exception.ResourceNotFoundException;
import com.punemumbai.cab.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    // ---- Public API ----

    public List<RouteResponse> getActiveRoutes() {
        return routeRepository.findByStatus(Route.Status.ACTIVE)
                .stream()
                .map(RouteResponse::new)
                .collect(Collectors.toList());
    }

    public RouteResponse getActiveRouteBySlug(String slug) {
        Route route = routeRepository.findBySlugAndStatus(slug, Route.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "slug", slug));
        return new RouteResponse(route);
    }

    // ---- Admin API ----

    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll()
                .stream()
                .map(RouteResponse::new)
                .collect(Collectors.toList());
    }

    public RouteResponse createRoute(RouteRequest request) {
        Route route = new Route();
        mapRequestToEntity(request, route);
        route.setStatus(Route.Status.ACTIVE);
        Route saved = routeRepository.save(route);
        return new RouteResponse(saved);
    }

    public RouteResponse updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", id));
        mapRequestToEntity(request, route);
        Route saved = routeRepository.save(route);
        return new RouteResponse(saved);
    }

    public void deactivateRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", id));
        route.setStatus(Route.Status.INACTIVE);
        routeRepository.save(route);
    }

    private void mapRequestToEntity(RouteRequest request, Route route) {
        route.setName(request.getName());
        route.setSlug(request.getSlug());
        route.setOrigin(request.getOrigin());
        route.setDestination(request.getDestination());
        route.setDistanceKm(request.getDistanceKm());
        route.setTravelTime(request.getTravelTime());
        route.setOneWayPrice(request.getOneWayPrice());
        route.setRoundTripPrice(request.getRoundTripPrice());
        route.setDescription(request.getDescription());
    }
}
