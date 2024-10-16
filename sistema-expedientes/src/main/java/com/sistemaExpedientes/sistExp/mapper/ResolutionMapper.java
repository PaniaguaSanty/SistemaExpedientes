package com.sistemaExpedientes.sistExp.mapper;


import com.sistemaExpedientes.sistExp.dto.request.ResolutionRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.ResolutionResponseDto;
import com.sistemaExpedientes.sistExp.model.Resolution;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


@Component
@Service
public class ResolutionMapper {

    private final ModelMapper modelMapper;

    public ResolutionMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ResolutionResponseDto convertToDto(Resolution resolution) {
        return modelMapper.map(resolution, ResolutionResponseDto.class);
    }

    public Resolution convertToEntity(ResolutionRequestDto resolutionRequestDto) {
        return modelMapper.map(resolutionRequestDto, Resolution.class);
    }
}
