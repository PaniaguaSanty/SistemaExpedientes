package com.sistemaExpedientes.sistExp.controller;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.service.ExpedientService;
import com.sistemaExpedientes.sistExp.util.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expedients")
@CrossOrigin(origins = "http://localhost:8080")
public class ExpedientController implements Controller<ExpedientResponseDTO, ExpedientRequestDTO> {

    private static final Logger logger = LoggerFactory.getLogger(ExpedientController.class);
    private final ExpedientService expedientService;

    public ExpedientController(ExpedientService expedientService) {
        this.expedientService = expedientService;
    }

    @Override
    @PostMapping("/create")
    public ResponseEntity<ExpedientResponseDTO> create(@RequestBody ExpedientRequestDTO expedientRequestDto) {
        logger.info("Entering create CONTROLLER method with data: {}", expedientRequestDto);
        ExpedientResponseDTO createdExp = expedientService.create(expedientRequestDto);
        logger.info("Exiting create CONTROLLER method...");
        return new ResponseEntity<>(createdExp, HttpStatus.CREATED);
    }

    @Override
    @PutMapping("/update")
    public ResponseEntity<ExpedientResponseDTO> update(@RequestBody ExpedientRequestDTO expedientRequestDto) {
        logger.info("Entering update CONTROLLER method with data: {}", expedientRequestDto);
        ExpedientResponseDTO updatedExp = expedientService.update(expedientRequestDto);
        logger.info("Exiting update CONTROLLER method...");
        return ResponseEntity.ok(updatedExp);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        logger.info("Entering delete CONTROLLER method with ID: {}", id);
        expedientService.delete(id);
        logger.info("Exiting delete CONTROLLER method...");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Método para agregar una ubicación a un expediente
    @PostMapping("/addLocation/{correlativeNumber}")
    public ResponseEntity<LocationResponseDto> addLocation(@PathVariable String
                                                                   correlativeNumber, @RequestBody LocationRequestDto locationDto) {
        logger.info("Entering addLocation CONTROLLER method...");
        try {
            LocationResponseDto location = expedientService.addLocation(correlativeNumber, locationDto);
            logger.info("Exiting addLocation CONTROLLER method successfully...");
            return new ResponseEntity<>(location, HttpStatus.CREATED);
        } catch (NotFoundException e) {
            logger.error("Expedient with correlative number {} not found", correlativeNumber);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Método para editar una ubicación existente
    @PutMapping("/editLocation/{locationId}")
    public ResponseEntity<LocationResponseDto> editLocation(@PathVariable Long locationId, @RequestBody LocationResponseDto locationDetails) {
        logger.info("Entering editLocation CONTROLLER method...");
        try {
            LocationResponseDto updatedLocation = expedientService.editLocation(locationId, locationDetails);
            logger.info("Exiting editLocation CONTROLLER method successfully...");
            return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
        } catch (NotFoundException e) {
            logger.error("Error in editLocation CONTROLLER method: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ExpedientResponseDTO> findById(@PathVariable String id) {
        logger.info("Entering findById CONTROLLER method with ID: {}", id);
        ExpedientResponseDTO expedient = expedientService.findOne(id);
        logger.info("Exiting findById CONTROLLER method...");
        return ResponseEntity.ok(expedient);
    }

    @Override
    @GetMapping("/findAll")
    public ResponseEntity<List<ExpedientResponseDTO>> findAll() {
        logger.info("Entering findAll CONTROLLER method...");
        List<ExpedientResponseDTO> expedients = expedientService.findAll();
        logger.info("Exiting findAll CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por código de organización
    @GetMapping("/organization/{orgCode}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByOrganizationCode(@PathVariable String orgCode) {
        logger.info("Entering findByOrganizationCode CONTROLLER method with orgCode: {}", orgCode);
        List<ExpedientResponseDTO> expedients = expedientService.findByOrganizationCode(orgCode);
        logger.info("Exiting findByOrganizationCode CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por año
    @GetMapping("/year/{year}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByYear(@PathVariable String year) {
        logger.info("Entering findByYear CONTROLLER method with year: {}", year);
        List<ExpedientResponseDTO> expedients = expedientService.findByYear(year);
        logger.info("Exiting findByYear CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por número correlativo
    @GetMapping("/correlative/{number}")
    public ResponseEntity<ExpedientResponseDTO> findByCorrelativeNumber(@PathVariable String number) {
        logger.info("Entering findByCorrelativeNumber CONTROLLER method with number: {}", number);
        ExpedientResponseDTO expedient = expedientService.findByCorrelativeNumber(number);
        logger.info("Exiting findByCorrelativeNumber CONTROLLER method...");
        return ResponseEntity.ok(expedient);
    }

    // Buscar por emisor
    @GetMapping("/issuer/{issuer}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByIssuer(@PathVariable String issuer) {
        logger.info("Entering findByIssuer CONTROLLER method with issuer: {}", issuer);
        List<ExpedientResponseDTO> expedients = expedientService.findByIssuer(issuer);
        logger.info("Exiting findByIssuer CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por tipo de solicitud
    @GetMapping("/solicitude/{solicitude}")
    public ResponseEntity<List<ExpedientResponseDTO>> findBySolicitude(@PathVariable String solicitude) {
        logger.info("Entering findBySolicitude CONTROLLER method with solicitude: {}", solicitude);
        List<ExpedientResponseDTO> expedients = expedientService.findBySolicitude(solicitude);
        logger.info("Exiting findBySolicitude CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByStatus(@PathVariable String status) {
        logger.info("Entering findByStatus CONTROLLER method with status: {}", status);
        List<ExpedientResponseDTO> expedients = expedientService.findByStatus(status);
        logger.info("Exiting findByStatus CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }
}
