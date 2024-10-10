package com.sistemaExpedientes.sistExp.util;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum Status {
    CANCELED("ESTADO CANCELADO"),
    IN_PROCESS("ESTADO EN PROCESO"),
    COMPLETED("ESTADO COMPLETADO");

    private final String description;


}
