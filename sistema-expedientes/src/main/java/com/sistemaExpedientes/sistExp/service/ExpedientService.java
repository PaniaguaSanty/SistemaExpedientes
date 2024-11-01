package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.AddLocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.AddLocationResponseDto;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.dto.response.RegulationResponseDto;
import com.sistemaExpedientes.sistExp.dto.response.SolicitudeDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.ExpedientMapper;
import com.sistemaExpedientes.sistExp.mapper.LocationMapper;
import com.sistemaExpedientes.sistExp.mapper.RegulationMapper;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpedientService implements CRUD<ExpedientResponseDTO, ExpedientRequestDTO> {


    private static final Logger logger = LoggerFactory.getLogger(ExpedientService.class);
    private final ExpedientRepository expedientRepository;
    private final LocationRepository locationRepository;
    private final ExpedientMapper expedientMapper;
    private final LocationMapper locationMapper;
    private final RegulationRepository regulationRepository;
    private final RegulationMapper regulationMapper;

    public ExpedientService(ExpedientRepository expedientRepository,
                            LocationRepository locationRepository,
                            ExpedientMapper expedientMapper,
                            LocationMapper locationMapper,
                            RegulationRepository regulationRepository,
                            RegulationMapper regulationMapper) {
        this.expedientRepository = expedientRepository;
        this.locationRepository = locationRepository;
        this.expedientMapper = expedientMapper;
        this.locationMapper = locationMapper;
        this.regulationRepository = regulationRepository;
        this.regulationMapper = regulationMapper;
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

    public AddLocationResponseDto addLocation(Long id, AddLocationRequestDto location) {
        logger.info("Entering in AddLocation SERVICE method...");
        Expedient expedient = expedientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expedient not found with id: " + id));
        Location locationToAdd = locationMapper.convertAddedLocationToEntity(location);
        if (expedient != null) {
            expedient.getLocations().add(locationToAdd);
            locationToAdd.setExpedient(expedient);
            logger.info("Exiting addLocation SERVICE method succesfully!");
            locationRepository.save(locationToAdd);
            return locationMapper.convertAddedLocationToDto(locationToAdd);
        }
        return null;
    }

    public AddLocationResponseDto editLocation(Long id, String existingPlace, AddLocationRequestDto locationDetails) {
        logger.info("Entering in EditLocation SERVICE method...");
        Expedient expedient = expedientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expedient not found with ID " + id));
        Location locationToUpdate = locationRepository.findByPlace(existingPlace);
        if (expedient != null) {
            locationToUpdate.setPlace(locationDetails.getPlace());
            locationToUpdate.setExpedient(expedient);
            Location updatedLocation = locationRepository.save(locationToUpdate);
            return locationMapper.convertAddedLocationToDto(locationToUpdate);
        }

        logger.info("Exiting in EditLocation SERVICE method succesfully!...");
        return null;
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
        List<Expedient> expedients = expedientRepository.findByIssuerIgnoreCase(issuer);
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

    public List<ExpedientResponseDTO> findByLocation(String location) {
        logger.info("Entering findByLocation SERVICE method with location: {}", location);

        // Obtener todos los expedientes
        List<Expedient> expedients = expedientRepository.findAll();
        // Filtrar los expedientes que tienen la ubicación especificada
        List<Expedient> filteredExpedients = expedients.stream()
                .filter(expedient -> expedient.getLocations() != null &&
                        expedient.getLocations().stream()
                                .anyMatch(loc -> loc.getPlace() != null && loc.getPlace().equals(location)))
                .collect(Collectors.toList());

        logger.info("Exiting findByLocation SERVICE method...");

        // Convertir a DTOs y devolver
        return filteredExpedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //Buscar todas las regulaciones correspondientes a un solicitante
    public List<RegulationResponseDto> findRegulationsByIssuer(String issuer) {
        logger.info("Entering findRegulationsByIssuer SERVICE method with issuer: {}", issuer);

        // Obtiene todas las regulaciones y aplica el filtro de 'issuer'
        List<Regulation> filteredRegulations = regulationRepository.findAll().stream()
                .filter(regulation -> regulation.getExpedient().getIssuer().contains(issuer))
                .collect(Collectors.toList());

        // Convierte la lista filtrada a DTOs
        return filteredRegulations.stream()
                .map(regulationMapper::convertToDto)
                .collect(Collectors.toList());

    }

    public List<SolicitudeDto> findSolicitudeByIssuer(String issuer) {
        logger.info("Entering findSolicitudeByIssuer SERVICE method with issuer: {}", issuer);

        // Obtener la lista de expedientes según el emisor
        List<Expedient> expedients = expedientRepository.findByIssuerIgnoreCase(issuer);

        // Mapear los expedientes a SolicitudeDTO
        List<SolicitudeDto> solicitudeDTOs = expedients.stream()
                .map(expedient -> new SolicitudeDto(
                        expedient.getId(),       // expedientId
                        expedient.getIssuer(),   // issuer
                        expedient.getSolicitude() // solicitude
                ))
                .collect(Collectors.toList());

        logger.info("Exiting findSolicitudeByIssuer SERVICE method successfully with {} results", solicitudeDTOs.size());
        return solicitudeDTOs;
    }

    public List<RegulationResponseDto> findRegulationsByExpedientId(Long expedientId) {
        logger.info("Entering findRegulationsByExpedientId SERVICE method with expedientId: {}", expedientId);

        // Obtiene todas las regulaciones que pertenecen al expediente con el ID dado
        List<Regulation> regulations = regulationRepository.findByExpedientId(expedientId);

        // Mapea las regulaciones a DTOs
        List<RegulationResponseDto> regulationDTOs = regulations.stream()
                .map(regulationMapper::convertToDto)
                .collect(Collectors.toList());

        logger.info("Exiting findRegulationsByExpedientId SERVICE method successfully with {} results", regulationDTOs.size());
        return regulationDTOs;
    }

}



