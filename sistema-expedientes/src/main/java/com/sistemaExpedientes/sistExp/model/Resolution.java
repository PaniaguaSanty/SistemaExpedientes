package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "resolutions")
public class Resolution {
    private String resolutionNumber;
    private Expedient expedient;
    private String status;
}
