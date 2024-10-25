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
public class Regulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description; //describe que pueda ser dictamen, circular, resolución y su nùmero,etc..

    //@Enumerated(EnumType.STRING)
   // private Status status;
    @ManyToOne
    @JoinColumn(name = "expedient_id")
    private Expedient expedient;

}
