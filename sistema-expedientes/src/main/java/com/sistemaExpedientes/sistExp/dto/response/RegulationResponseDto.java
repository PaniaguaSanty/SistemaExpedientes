package com.sistemaExpedientes.sistExp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegulationResponseDto {
    private Long id;
    private String description;
    private Long expedientId; // Reference to the associated Expedient
}
