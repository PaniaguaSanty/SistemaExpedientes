package com.sistemaExpedientes.sistExp.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
public class ExpedientRequestDTO {
    private Long id;
    private String issuer;
    private String organizationCode;
    private String correlativeNumber;
    private String solicitude;
    private String year;
    private String status;

}
