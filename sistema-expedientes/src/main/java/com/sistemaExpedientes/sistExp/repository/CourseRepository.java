package com.sistemaExpedientes.sistExp.repository;

import com.sistemaExpedientes.sistExp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}
