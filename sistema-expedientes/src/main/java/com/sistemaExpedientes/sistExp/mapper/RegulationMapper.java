package com.sistemaExpedientes.sistExp.mapper;


import com.sistemaExpedientes.sistExp.dto.request.RegulationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.RegulationResponseDto;
import com.sistemaExpedientes.sistExp.model.Regulation;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


@Component
@Service
public class RegulationMapper {

    private final ModelMapper modelMapper;

    public RegulationMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public RegulationResponseDto convertToDto(Regulation regulation) {
        return modelMapper.map(regulation, RegulationResponseDto.class);
    }

    public Regulation convertToEntity(RegulationRequestDto regulationRequestDto) {
        return modelMapper.map(regulationRequestDto, Regulation.class);
    }
}
