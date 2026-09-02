package com.punemumbai.cab.repository;

import com.punemumbai.cab.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatus(Vehicle.Status status);

    Optional<Vehicle> findBySlug(String slug);

    Optional<Vehicle> findBySlugAndStatus(String slug, Vehicle.Status status);
}
