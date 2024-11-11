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

    private String place;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expedient_id")
    @JsonBackReference // Rompe el ciclo de serialización aquí
    private Expedient expedient;
}
