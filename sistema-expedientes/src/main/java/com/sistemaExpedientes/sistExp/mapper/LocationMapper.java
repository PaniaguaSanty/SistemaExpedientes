package com.sistemaExpedientes.sistExp.mapper;

import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.model.Location;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
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
