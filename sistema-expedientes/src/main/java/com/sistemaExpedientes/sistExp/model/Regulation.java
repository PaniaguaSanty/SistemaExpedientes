package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resolutions")
public class Regulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String resolutionNumber;

    @ManyToOne
    @JoinColumn(name = "expedient_id")
    private Expedient expedient;

    private String status;
}
