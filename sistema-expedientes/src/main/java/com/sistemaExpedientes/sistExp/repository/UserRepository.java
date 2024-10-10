package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


}
