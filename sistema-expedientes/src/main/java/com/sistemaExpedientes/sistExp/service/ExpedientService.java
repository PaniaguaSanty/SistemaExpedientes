package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.ExpedientMapper;
import com.sistemaExpedientes.sistExp.mapper.LocationMapper;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpedientService implements CRUD<ExpedientResponseDTO, ExpedientRequestDTO> {

    private final ExpedientRepository expedientRepository;
    private final LocationRepository locationRepository;
    private final ExpedientMapper expedientMapper;
    private final LocationMapper locationMapper;

    public ExpedientService(ExpedientRepository expedientRepository,
                            LocationRepository locationRepository,
                            ExpedientMapper expedientMapper,
                            LocationMapper locationMapper) {
        this.expedientRepository = expedientRepository;
        this.locationRepository = locationRepository;
        this.expedientMapper = expedientMapper;
        this.locationMapper = locationMapper;
    }

    @Override
    public ExpedientResponseDTO create(ExpedientRequestDTO expedientRequestDTO) {
        try {
            Expedient expedient = expedientMapper.convertToEntity(expedientRequestDTO);
            Expedient expedientSaved = expedientRepository.save(expedient);
            return expedientMapper.convertToDto(expedientSaved);
        } catch (Exception e) {
            throw new NotFoundException("Error while creating the expedient...");
        }
    }

    @Override
    public ExpedientResponseDTO update(ExpedientRequestDTO expedientRequestDTO) {
        try {
            Expedient existingExpedient = expedientRepository.findByCorrelativeNumber(expedientRequestDTO.getCorrelativeNumber());

            existingExpedient.setIssuer(expedientRequestDTO.getIssuer());
            existingExpedient.setOrganizationCode(expedientRequestDTO.getOrganizationCode());
            existingExpedient.setCorrelativeNumber(expedientRequestDTO.getCorrelativeNumber());
            existingExpedient.setSolicitude(expedientRequestDTO.getSolicitude());
            existingExpedient.setYear(expedientRequestDTO.getYear());
            existingExpedient.setRegulations(expedientRequestDTO.getRegulations());
            existingExpedient.setPdfPath(expedientRequestDTO.getPdfPath());

            Expedient updatedExpedient = expedientRepository.save(existingExpedient);
            return expedientMapper.convertToDto(updatedExpedient);
        } catch (Exception e) {
            throw new NotFoundException("Error while updating the expedient...");
        }
    }

    @Override
    public void delete(String id) {
        Expedient expedient = expedientRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new NotFoundException("Expedient not found with the current ID..."));
        expedientRepository.delete(expedient);
    }

    public Location addLocation(String correlativeNumber, Location location) {
        Expedient expedient = expedientRepository.findByCorrelativeNumber(correlativeNumber);
        if (expedient != null) {
            location.setExpedient(expedient);
            location.setDate(String.valueOf(LocalDateTime.now()));
            return locationRepository.save(location);
        }
        return null;
    }

    public LocationResponseDto editLocation(Long locationId, LocationResponseDto locationDetails) {
        Location existingLocation = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found with ID " + locationId));
        Expedient expedient = expedientRepository.findByCorrelativeNumber(locationDetails.getExpedient().getCorrelativeNumber());
        if (expedient != null) {
            existingLocation.setExpedient(expedient);
        }
        existingLocation.setPlace(locationDetails.getPlace());
        existingLocation.setDate(String.valueOf(LocalDateTime.now())); // Updating the date to reflect the edit
        Location updatedLocation = locationRepository.save(existingLocation);
        return locationMapper.convertToDto(updatedLocation); // Conversión a DTO
    }

    @Override
    public ExpedientResponseDTO findOne(String id) {
        Expedient expedient = expedientRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Expedient not found with ID " + id));
        return expedientMapper.convertToDto(expedient);
    }

    @Override
    public List<ExpedientResponseDTO> findAll() {
        List<Expedient> expedients = expedientRepository.findAll();
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por codigo de org.
    public List<ExpedientResponseDTO> findByOrganizationCode(String orgCode) {
        List<Expedient> expedients = expedientRepository.findByOrganizationCode(orgCode);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por año
    public List<ExpedientResponseDTO> findByYear(String year) {
        List<Expedient> expedients = expedientRepository.findByYear(year);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por n° correlativo
    public ExpedientResponseDTO findByCorrelativeNumber(String number) {
        Expedient expedient = expedientRepository.findByCorrelativeNumber(number);
        return expedientMapper.convertToDto(expedient);
    }

    //buscar por emisor
    public List<ExpedientResponseDTO> findByIssuer(String issuer) {
        List<Expedient> expedients = expedientRepository.findByIssuer(issuer);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por tipo de solicitud
    public List<ExpedientResponseDTO> findBySolicitude(String solicitude) {
        List<Expedient> expedients = expedientRepository.findBySolicitude(solicitude);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por estado
    public List<ExpedientResponseDTO> findByStatus(String status) {
        List<Expedient> expedients = expedientRepository.findByStatus(status);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

}


