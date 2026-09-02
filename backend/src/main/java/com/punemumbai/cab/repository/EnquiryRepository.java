package com.punemumbai.cab.repository;

import com.punemumbai.cab.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findByStatus(Enquiry.EnquiryStatus status);

    List<Enquiry> findAllByOrderByCreatedAtDesc();
}
