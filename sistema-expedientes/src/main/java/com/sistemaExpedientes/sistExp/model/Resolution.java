package com.sistemaExpedientes.sistExp.model;

import com.sistemaExpedientes.sistExp.util.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resolutions")
public class Resolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resolutionNumber;
    private String description; //describe que pueda ser dictamen, circular, resolución,etc..

    //@Enumerated(EnumType.STRING)
   // private Status status;
    @ManyToOne
    @JoinColumn(name = "expedient_id")
    private Expedient expedient;

}
