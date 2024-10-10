package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.UserRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.UserResponseDTO;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.UserMapper;
import com.sistemaExpedientes.sistExp.model.User;
import com.sistemaExpedientes.sistExp.repository.UserRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Service
public class UserService implements CRUD<UserResponseDTO, UserRequestDTO> {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Override
    public UserResponseDTO create(UserRequestDTO userRequestDTO) {
        if (userRepository.findById(userRequestDTO.getId()).isPresent()) {
            throw new NotFoundException("Ya existe un usuario con ID: " + userRequestDTO.getId());
        }
        User user = userMapper.dtoToEntity(userRequestDTO);
        User savedUser = userRepository.save(user);
        return userMapper.entityToDTO(savedUser);
    }

    @Override
    public UserResponseDTO update(UserRequestDTO userRequestDTO) {
        User existingUser = verifyUser(userRequestDTO.getId());
        if (userRequestDTO.getName() != null && !userRequestDTO.getName().trim().isEmpty()) {
            existingUser.setName(userRequestDTO.getName());
        }
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword(userRequestDTO.getPassword());
        }
        User updatedUser = userRepository.save(existingUser);
        return userMapper.entityToDTO(updatedUser);
    }

    @Override
    public void delete(String id) {
        User existingUser = verifyUser(Long.valueOf(id));
        userRepository.delete(existingUser);
    }

    public User verifyUser(Long id){
       return userRepository.findById(id).orElseThrow(()-> new NotFoundException("No existe un usuario con el ID " + id));
    }
    @Override
    public UserResponseDTO findOne(String id) {
        User user = verifyUser(Long.parseLong(id));
        return userMapper.entityToDTO(user);
    }

    @Override
    public List<UserResponseDTO> findAll() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::entityToDTO)
                .collect(Collectors.toList());
    }
}
