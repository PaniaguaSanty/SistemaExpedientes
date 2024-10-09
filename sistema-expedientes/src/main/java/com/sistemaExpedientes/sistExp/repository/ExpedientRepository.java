
package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.Expedient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpedientRepository extends JpaRepository<Expedient, Long> {

    List<Expedient> findByOrganizationCode(String organizationCode);
    List<Expedient> findByYear(String year);
    Expedient findByCorrelativeNumber(String number);
    List<Expedient> findByIssuer(String issuer);
    List<Expedient> findBySolicitude(String solicitude);
    List<Expedient> findByStatus(String status);


}


