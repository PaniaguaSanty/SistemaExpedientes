package com.sistemaExpedientes.sistExp.mapper;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.model.Expedient;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Component
public class ExpedientMapper {

    private final ModelMapper modelMapper;

    public ExpedientMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ExpedientResponseDTO convertToDto(Expedient expedient) {
        return modelMapper.map(expedient, ExpedientResponseDTO.class);
    }

    public Expedient convertToEntity(ExpedientRequestDTO expedientRequestDto) {
        return modelMapper.map(expedientRequestDto, Expedient.class);
    }

    public List<ExpedientResponseDTO> convertToDtoAllPersons(List<Expedient> allPersons) {
        return allPersons.stream()
                .map(this::convertToDto) // Convierte cada objeto Person a PersonResponseDto
                .collect(Collectors.toList()); // Crea una lista con los objetos convertidos
    }
}


