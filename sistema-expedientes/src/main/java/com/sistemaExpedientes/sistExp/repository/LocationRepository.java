package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Location findByPlace(String place);
}
