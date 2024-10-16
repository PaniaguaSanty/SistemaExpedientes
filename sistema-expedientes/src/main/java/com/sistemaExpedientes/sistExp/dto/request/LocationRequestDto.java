package com.sistemaExpedientes.sistExp.dto.request;

import com.sistemaExpedientes.sistExp.model.Expedient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocationRequestDto {

    private String origin;
    private String destiny;
    private String date;
    private Long expedientId;
}
