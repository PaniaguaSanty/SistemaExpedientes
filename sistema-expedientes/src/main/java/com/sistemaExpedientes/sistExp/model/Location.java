// Location.java
package com.sistemaExpedientes.sistExp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String date;
    private String origin;
    private String destiny;
    private String place;

    @ManyToOne
    @JoinColumn(name = "expedient_id")
    @JsonBackReference // Rompe el ciclo de serialización aquí
    private Expedient expedient;
}
