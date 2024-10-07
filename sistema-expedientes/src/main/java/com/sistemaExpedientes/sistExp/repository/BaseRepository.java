package com.sistemaExpedientes.sistExp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaseRepository<T, D> extends JpaRepository<T,D> {
}