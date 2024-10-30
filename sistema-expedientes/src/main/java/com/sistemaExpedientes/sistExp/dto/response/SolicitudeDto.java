package com.sistemaExpedientes.sistExp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudeDto {
    private Long expedientId;
    private String issuer;
    private String solicitude;
}
