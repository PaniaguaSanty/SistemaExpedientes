package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.Resolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResolutionRepository extends JpaRepository<Resolution, Long> {

}
