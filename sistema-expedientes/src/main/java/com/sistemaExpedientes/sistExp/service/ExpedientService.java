package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpedientService implements CRUD<ExpedientResponseDTO, ExpedientRequestDTO> {


    private static final Logger logger = LoggerFactory.getLogger(ExpedientService.class);
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
        logger.info("Entering in create SERVICE method with data: {} ", expedientRequestDTO);
        try {
            Expedient expedient = expedientMapper.convertToEntity(expedientRequestDTO);
            Expedient expedientSaved = expedientRepository.save(expedient);
            logger.info("Exiting create SERVICE method...");
            return expedientMapper.convertToDto(expedientSaved);
        } catch (Exception e) {
            throw new NotFoundException("Error while creating the expedient...");
        }
    }

    @Override
    public ExpedientResponseDTO update(ExpedientRequestDTO expedientRequestDTO) {
        logger.info("Entering in update SERVICE method with data: {} ", expedientRequestDTO);
        try {
            Expedient existingExpedient = expedientRepository.findByCorrelativeNumber(expedientRequestDTO.getCorrelativeNumber());

            existingExpedient.setIssuer(expedientRequestDTO.getIssuer());
            existingExpedient.setOrganizationCode(expedientRequestDTO.getOrganizationCode());
            existingExpedient.setCorrelativeNumber(expedientRequestDTO.getCorrelativeNumber());
            existingExpedient.setSolicitude(expedientRequestDTO.getSolicitude());
            existingExpedient.setYear(expedientRequestDTO.getYear());
            existingExpedient.setRegulations(String.valueOf(expedientRequestDTO.getRegulations()));
            existingExpedient.setPdfPath(expedientRequestDTO.getPdfPath());

            Expedient updatedExpedient = expedientRepository.save(existingExpedient);
            logger.info("Exiting Update SERVICE method...");
            return expedientMapper.convertToDto(updatedExpedient);
        } catch (Exception e) {
            throw new NotFoundException("Error while updating the expedient...");
        }
    }

    @Override
    public void delete(String id) {
        logger.info("Entering in Delete SERVICE method...");
        Expedient expedient = expedientRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new NotFoundException("Expedient not found with the current ID..."));
        logger.info("Exiting Delete SERVICE method...");
        expedientRepository.delete(expedient);
    }

    public LocationResponseDto addLocation(String correlativeNumber, LocationRequestDto location) {
        logger.info("Entering in AddLocation SERVICE method...");
        Expedient expedient = expedientRepository.findByCorrelativeNumber(correlativeNumber);
        Location locationToAdd = locationMapper.convertToEntity(location);
        if (expedient != null) {
            location.setExpedient(expedient);
            location.setDate(String.valueOf(LocalDateTime.now()));
            logger.info("Exiting addLocation SERVICE method succesfully!");
            locationRepository.save(locationToAdd);
            return locationMapper.convertToDto(locationToAdd);
        }
        return null;
    }

    public LocationResponseDto editLocation(Long locationId, LocationResponseDto locationDetails) {
        logger.info("Entering in EditLocation SERVICE method...");
        Location existingLocation = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found with ID " + locationId));
        Expedient expedient = expedientRepository.findByCorrelativeNumber(locationDetails.getExpedient().getCorrelativeNumber());
        if (expedient != null) {
            existingLocation.setExpedient(expedient);
        }
        existingLocation.setPlace(locationDetails.getPlace());
        existingLocation.setDate(String.valueOf(LocalDateTime.now())); // Updating the date to reflect the edit
        logger.info("Exiting in EditLocation SERVICE method succesfully!...");
        Location updatedLocation = locationRepository.save(existingLocation);
        return locationMapper.convertToDto(updatedLocation);
    }

    @Override
    public ExpedientResponseDTO findOne(String id) {
        logger.info("Entering in findOne SERVICE method...");
        Expedient expedient = expedientRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Expedient not found with ID " + id));
        logger.info("Exiting findOne SERVICE method...");
        return expedientMapper.convertToDto(expedient);
    }

    @Override
    public List<ExpedientResponseDTO> findAll() {
        logger.info("Entering in findAll SERVICE method...");
        List<Expedient> expedients = expedientRepository.findAll();
        logger.info("Exiting findAll SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por codigo de org.
    public List<ExpedientResponseDTO> findByOrganizationCode(String orgCode) {
        logger.info("Entering in findByOrganizationCode SERVICE method with organization code: {}", orgCode);
        List<Expedient> expedients = expedientRepository.findByOrganizationCode(orgCode);
        logger.info("Exiting findByOrganizationCode SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por año
    public List<ExpedientResponseDTO> findByYear(String year) {
        logger.info("Entering in findByYear SERVICE method with year: {}", year);
        List<Expedient> expedients = expedientRepository.findByYear(year);
        logger.info("Exiting findByYear SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por n° correlativo
    public ExpedientResponseDTO findByCorrelativeNumber(String number) {
        logger.info("Entering in findByCorrelativeNumber SERVICE method with correlative number: {}", number);
        Expedient expedient = expedientRepository.findByCorrelativeNumber(number);
        logger.info("Exiting findByCorrelativeNumber SERVICE method...");
        return expedientMapper.convertToDto(expedient);
    }

    //buscar por emisor
    public List<ExpedientResponseDTO> findByIssuer(String issuer) {
        logger.info("Entering in findByIssuer SERVICE method with issuer: {}", issuer);
        List<Expedient> expedients = expedientRepository.findByIssuer(issuer);
        logger.info("Exiting findByIssuer SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por tipo de solicitud
    public List<ExpedientResponseDTO> findBySolicitude(String solicitude) {
        logger.info("Entering in findBySolicitude SERVICE method with solicitude: {}", solicitude);
        List<Expedient> expedients = expedientRepository.findBySolicitude(solicitude);
        logger.info("Exiting findBySolicitude SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por estado
    public List<ExpedientResponseDTO> findByStatus(String status) {
        logger.info("Entering in findByStatus SERVICE method with status: {}", status);
        List<Expedient> expedients = expedientRepository.findByStatus(status);
        logger.info("Exiting findByStatus SERVICE method...");
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

}

