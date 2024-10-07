package com.sistemaExpedientes.sistExp.model;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "locations")
public class Location {
    private String origin;
    private String destiny;
    private String date;

}
