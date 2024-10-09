package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String origin;
    private String destiny;
    private String date;

    @ManyToOne
    @JoinColumn(name = "expedient_id")
    private Expedient expedient;
}
