package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String date;
    private String place;
    @ManyToOne
    @JoinColumn(name = "expedient_id")
    private Expedient expedient;
}
