package com.sistemaExpedientes.sistExp.util;

public interface Mapper <E, R, Q>{
    E dtoToEntity(Q q);
    R entityToDTO(E e);
}
