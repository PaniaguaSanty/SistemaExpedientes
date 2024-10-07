package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@Table(name = "expedients")
public class Expedient {
    private String issuer;
    private String organizationCode;
    private String correlativeNumber;
    private String solicitude;
    private String year;
    private String status;
}
