package com.sistemaExpedientes.sistExp.util;

import java.util.List;

public interface CRUD<R, Q> {

    R create(Q q);

    R update(Q q);

    void delete(String id);

    R findOne(String id);

    List<R> findAll();


}
