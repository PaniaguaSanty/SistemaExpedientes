package com.sistemaExpedientes.sistExp.dto.response;

import com.sistemaExpedientes.sistExp.model.Expedient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponseDto {

    private Long id;
    private String origin;
    private String destiny;
    private String date;
    private Expedient expedient;
}
