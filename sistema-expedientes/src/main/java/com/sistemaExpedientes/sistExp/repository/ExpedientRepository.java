package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.Expedient;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpedientRepository extends BaseRepository<Expedient, Long> {

}
