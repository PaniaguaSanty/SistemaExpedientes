package com.sistemaExpedientes.sistExp.dto.request;

import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
public class ExpedientRequestDTO {

    private Long id;
    private String issuer;
    private String organizationCode;
    private String correlativeNumber;
    private String solicitude;
    private String year;
    private String pdfPath;
    private List<Regulation> regulations;
    private List<Location> locations;
}
