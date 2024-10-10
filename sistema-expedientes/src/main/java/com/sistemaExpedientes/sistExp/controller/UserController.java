package com.sistemaExpedientes.sistExp.controller;

import com.sistemaExpedientes.sistExp.dto.request.UserRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.UserResponseDTO;
import com.sistemaExpedientes.sistExp.service.UserService;
import com.sistemaExpedientes.sistExp.util.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController implements Controller<UserResponseDTO, UserRequestDTO> {

    @Autowired
    private UserService userService;

    @Override
    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO createdUser = userService.create(userRequestDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @Override
    @PutMapping
    public ResponseEntity<UserResponseDTO> update(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO updatedUser = userService.update(userRequestDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable String id) {
        UserResponseDTO user = userService.findOne(id);
        return ResponseEntity.ok(user);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        List<UserResponseDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
}
