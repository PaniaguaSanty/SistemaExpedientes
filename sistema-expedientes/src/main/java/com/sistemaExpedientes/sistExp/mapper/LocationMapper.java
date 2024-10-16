package com.sistemaExpedientes.sistExp.mapper;

import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.request.ResolutionRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.dto.response.ResolutionResponseDto;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Resolution;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
public class LocationMapper {

    private final ModelMapper modelMapper;

    public LocationMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public LocationResponseDto convertToDto(Location location) {
        return modelMapper.map(location, LocationResponseDto.class);
    }

    public Location convertToEntity(LocationRequestDto locationRequestDto) {
        return modelMapper.map(locationRequestDto, Location.class);
    }


}
