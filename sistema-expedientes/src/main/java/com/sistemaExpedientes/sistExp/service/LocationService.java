package com.sistemaExpedientes.sistExp.service;


import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.LocationMapper;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService implements CRUD<LocationResponseDto, LocationRequestDto> {

    private final LocationMapper locationMapper;
    private final LocationRepository locationRepository;


    @Override
    public LocationResponseDto create(LocationRequestDto locationRequestDto) {
        try {
            Location location = locationMapper.convertToEntity(locationRequestDto);
            Location locationSaved = locationRepository.save(location);
            return locationMapper.convertToDto(locationSaved);
        } catch (Exception e) {
            throw new NotFoundException("Error while creating the location");
        }
    }

    @Override
    public LocationResponseDto update(LocationRequestDto locationRequestDto) {
        try {
            Location existingLocation = verifyLocation(locationRequestDto.getExpedientId());

            existingLocation.setOrigin(locationRequestDto.getOrigin());
            existingLocation.setDestiny(locationRequestDto.getDestiny());
            Location updatedLocation = locationRepository.save(existingLocation);
            return locationMapper.convertToDto(updatedLocation);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while updating the resolution");
        }
    }

    @Override
    public void delete(String id) {
        Location location = verifyLocation(Long.parseLong(id));
        locationRepository.delete(location);
    }

    @Override
    public LocationResponseDto findOne(String id) {
        Location location = verifyLocation(Long.parseLong(id));
        return locationMapper.convertToDto(location);
    }

    @Override
    public List<LocationResponseDto> findAll() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream()
                .map(locationMapper::convertToDto)
                .collect(Collectors.toList());
    }

    private Location verifyLocation(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No existe una ubicacicón con el ID " + id));
    }
}

