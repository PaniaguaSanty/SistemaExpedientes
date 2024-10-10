package com.sistemaExpedientes.sistExp.util;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface Controller <R, Q>{
    ResponseEntity<R> create(Q q);
    ResponseEntity<R> update(Q q);
    ResponseEntity<Void> delete(String id);
    ResponseEntity<R> findById(String id);
    ResponseEntity<List<R>> findAll();

}
