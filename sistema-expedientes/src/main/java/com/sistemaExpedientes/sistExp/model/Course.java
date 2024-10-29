package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "denominations", length = 800)
    private String denominations;

    @Column(name = "recipients", length = 800)
    private String recipients;

    @Column(name = "responsible_institutions", length = 800)
    private String responsibleInstitutions;

    @Column(name = "year", length = 800)
    private String year;
}
