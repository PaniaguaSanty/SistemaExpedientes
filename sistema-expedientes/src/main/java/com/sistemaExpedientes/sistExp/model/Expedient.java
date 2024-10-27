package com.sistemaExpedientes.sistExp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

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
    private String pdfPath;

    @OneToMany(mappedBy = "expedient")
    @JsonManagedReference // Rompe el ciclo para regulations
    private List<Regulation> regulations;

    @OneToMany(mappedBy = "expedient")
    @JsonManagedReference // Rompe el ciclo para locations
    private List<Location> locations;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public void setRegulations(String value) {
    }
}
