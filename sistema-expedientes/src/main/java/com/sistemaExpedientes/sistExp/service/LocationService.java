package com.sistemaExpedientes.sistExp.service;


import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.LocationMapper;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private final LocationMapper locationMapper;
    private final LocationRepository locationRepository;

    public LocationService(LocationMapper locationMapper, LocationRepository locationRepository) {
        this.locationMapper = locationMapper;
        this.locationRepository = locationRepository;
    }

    public LocationResponseDto create(LocationRequestDto locationRequestDto) {
        try {
            Location expedient = locationMapper.convertToEntity(locationRequestDto);
            Location expedientSaved = locationRepository.save(expedient);
            return locationMapper.convertToDto(expedientSaved);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while creating the expedient");
        }
    }

    public LocationResponseDto update(Long id, LocationRequestDto locationRequestDto) {
        try {
            Location existingLocation = locationRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Location not found with current id...."));

            existingLocation.setExpedient(locationRequestDto.getExpedient());

            Location updatedLocation = locationRepository.save(existingLocation);
            return locationMapper.convertToDto(existingLocation);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while updting the expedient");
        }
    }

    public void delete(String id) {
        Location location = verifyLocation(Long.parseLong(id));
        locationRepository.delete(location);
    }


    //buscar por id
    public LocationResponseDto findOne(String id) {
        Location location = verifyLocation(Long.parseLong(id));
        return locationMapper.convertToDto(location);
    }

    private Location verifyLocation(Long id) {
        return locationRepository.findById(id).orElseThrow(() -> new NotFoundException("No existe un expediente con el ID " + id));
    }
}
