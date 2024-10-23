package com.sistemaExpedientes.sistExp.dto.request;

import com.sistemaExpedientes.sistExp.util.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegulationRequestDto {
    private String resolutionNumber;
    private String description;
    private Status status;
    private Long expedientId; // Reference to the associated Expedient
}
