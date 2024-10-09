package com.sistemaExpedientes.sistExp.dto.request;

import lombok.Data;

@Data
public class UserRequestDTO {
    private Long id;
    private String name;
    private String password;
}
