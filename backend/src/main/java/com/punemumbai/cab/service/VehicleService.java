package com.punemumbai.cab.service;

import com.punemumbai.cab.dto.VehicleRequest;
import com.punemumbai.cab.dto.VehicleResponse;
import com.punemumbai.cab.entity.Vehicle;
import com.punemumbai.cab.exception.ResourceNotFoundException;
import com.punemumbai.cab.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // ---- Public API ----

    public List<VehicleResponse> getActiveVehicles() {
        return vehicleRepository.findByStatus(Vehicle.Status.ACTIVE)
                .stream()
                .map(VehicleResponse::new)
                .collect(Collectors.toList());
    }

    public VehicleResponse getActiveVehicleBySlug(String slug) {
        Vehicle vehicle = vehicleRepository.findBySlugAndStatus(slug, Vehicle.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "slug", slug));
        return new VehicleResponse(vehicle);
    }

    // ---- Admin API ----

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleResponse::new)
                .collect(Collectors.toList());
    }

    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        mapRequestToEntity(request, vehicle);
        vehicle.setStatus(Vehicle.Status.ACTIVE);
        Vehicle saved = vehicleRepository.save(vehicle);
        return new VehicleResponse(saved);
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        mapRequestToEntity(request, vehicle);
        Vehicle saved = vehicleRepository.save(vehicle);
        return new VehicleResponse(saved);
    }

    public void deactivateVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        vehicle.setStatus(Vehicle.Status.INACTIVE);
        vehicleRepository.save(vehicle);
    }

    private void mapRequestToEntity(VehicleRequest request, Vehicle vehicle) {
        vehicle.setName(request.getName());
        vehicle.setSlug(request.getSlug());
        vehicle.setImageUrl(request.getImageUrl());
        vehicle.setSeatingCapacity(request.getSeatingCapacity());
        vehicle.setDescription(request.getDescription());
        vehicle.setPrice(request.getPrice());
    }
}
