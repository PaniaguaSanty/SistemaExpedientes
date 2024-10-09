package com.sistemaExpedientes.sistExp.mapper;

import com.sistemaExpedientes.sistExp.dto.request.UserRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.UserResponseDTO;
import com.sistemaExpedientes.sistExp.model.User;
import com.sistemaExpedientes.sistExp.util.Mapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper implements Mapper<User, UserResponseDTO, UserRequestDTO> {
    @Override
    public User dtoToEntity(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setId(userRequestDTO.getId());
        user.setName(userRequestDTO.getName());
        user.setPassword(userRequestDTO.getPassword());

        return user;
    }

    @Override
    public UserResponseDTO entityToDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();

        userResponseDTO.setName(user.getName());

        return userResponseDTO;
    }
}
