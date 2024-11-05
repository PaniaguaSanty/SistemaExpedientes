package com.sistemaExpedientes.sistExp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

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
    private String pdfPath;

    @OneToMany(mappedBy = "expedient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Regulation> regulations;

    @OneToMany(mappedBy = "expedient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Location> locations;

    public void setRegulations(String value) {
    }
}
