package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
