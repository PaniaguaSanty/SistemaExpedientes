    package com.sistemaExpedientes.sistExp.repository;

    import com.sistemaExpedientes.sistExp.model.Expedient;
    import com.sistemaExpedientes.sistExp.model.Regulation;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    import java.util.List;
    import java.util.Optional;

    @Repository
    public interface RegulationRepository extends JpaRepository<Regulation, Long> {

        List<Regulation> findByExpedientId(Long expedientId);

        Optional<Regulation> findByDescriptionAndExpedient(String currentDescription, Expedient expedient);
    }
