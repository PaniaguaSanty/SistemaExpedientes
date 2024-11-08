package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import lombok.*;

@Data
@Entity
@Table(name = "expedients")
public class Expedient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String issuer;
    private String organizationCode;
    private String correlativeNumber;
    private String solicitude;
    private String year;
    private String status;
    private LocalDate date;

    @OneToMany(mappedBy = "expedient")
    private List<Resolution> resolutions;

    @OneToMany(mappedBy = "expedient")
    private List<Location> locations;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
