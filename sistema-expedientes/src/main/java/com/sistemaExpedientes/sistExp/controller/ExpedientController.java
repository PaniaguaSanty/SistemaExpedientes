package com.sistemaExpedientes.sistExp.controller;

import com.sistemaExpedientes.sistExp.dto.request.AddLocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.AddLocationResponseDto;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.dto.response.RegulationResponseDto;
import com.sistemaExpedientes.sistExp.dto.response.SolicitudeDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.service.ExcelService;
import com.sistemaExpedientes.sistExp.service.ExpedientService;
import com.sistemaExpedientes.sistExp.util.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/expedients")
@CrossOrigin(origins = "http://localhost:8080")
public class ExpedientController implements Controller<ExpedientResponseDTO, ExpedientRequestDTO> {

    private static final Logger logger = LoggerFactory.getLogger(ExpedientController.class);
    private final ExpedientService expedientService;
    private final ExcelService excelService;

    public ExpedientController(ExpedientService expedientService, ExcelService excelService) {
        this.expedientService = expedientService;
        this.excelService = excelService;
    }

    @Override
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
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
    @PutMapping("/addLocation/{id}")
    public ResponseEntity<AddLocationResponseDto> addLocation(@PathVariable Long id,
                                                              @RequestBody AddLocationRequestDto locationDto) {
        logger.info("Entering addLocation CONTROLLER method...");
        try {
            AddLocationResponseDto location = expedientService.addLocation(id, locationDto);
            logger.info("Exiting addLocation CONTROLLER method successfully...");
            return new ResponseEntity<>(location, HttpStatus.CREATED);
        } catch (NotFoundException e) {
            logger.error("Expedient with ID: {} not found", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Método para editar una ubicación existente
    @PutMapping("/editLocation/{id}/{existingPlace}")
    public ResponseEntity<AddLocationResponseDto> editLocation(@PathVariable Long id, @PathVariable String existingPlace,
                                                               @RequestBody AddLocationRequestDto locationDetails) {
        logger.info("Entering editLocation CONTROLLER method...");
        try {
            AddLocationResponseDto updatedLocation = expedientService.editLocation(id, existingPlace, locationDetails);
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

    //Buscar por Location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByLocation(@PathVariable String location) {
        logger.info("Entering in findByLocation CONTROLLER method with location {}", location);
        List<ExpedientResponseDTO> expedients = expedientService.findByLocation(location);
        logger.info("Exiting findByLocation CONTROLLER method...");
        return ResponseEntity.ok(expedients);
    }

    // Buscar por tipo de solicitud
    @GetMapping("regulations/{id}")
    public ResponseEntity<List<RegulationResponseDto>> findRegulationsByExpedientId(@PathVariable("id") Long expedientId) {
        logger.info("Entering getRegulationsByExpedientId CONTROLLER method with expedientId: {}", expedientId);

        List<RegulationResponseDto> regulations = expedientService.findRegulationsByExpedientId(expedientId);

        if (regulations.isEmpty()) {
            logger.info("No regulations found for expedientId: {}", expedientId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        logger.info("Exiting getRegulationsByExpedientId CONTROLLER method successfully with {} results", regulations.size());
        return new ResponseEntity<>(regulations, HttpStatus.OK);
    }
    @GetMapping("/solicitudes/{issuer}")
    public ResponseEntity<List<SolicitudeDto>> findSolicitudeByIssuer(@PathVariable String issuer) {
        logger.info("Entering findSolicitudeByIssuer CONTROLLER method with issuer: {}", issuer);
        List<SolicitudeDto> solicitudeDTOs = expedientService.findSolicitudeByIssuer(issuer);

        if (solicitudeDTOs.isEmpty()) {
            logger.info("No solicitudes found for issuer: {}", issuer);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        logger.info("Exiting findSolicitudeByIssuer CONTROLLER method successfully with {} results", solicitudeDTOs.size());
        return new ResponseEntity<>(solicitudeDTOs, HttpStatus.OK);
    }

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
    // Endpoint para subir el archivo Excel, convertir a CSV e insertar en la base de datos

    @PostMapping("/upload")
    public ResponseEntity<String> uploadExcelFile(@RequestParam("file") MultipartFile file) {
        try {
            // Convertir Excel a CSV
            File csvFile = excelService.convertExcelToCsv(file);
            // Insertar el CSV en la base de datos
            excelService.insertCsvToDatabase(csvFile);
            return ResponseEntity.status(HttpStatus.OK).body("Archivo subido y datos guardados correctamente!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo: " + e.getMessage());
        }
    }
    // Endpoint para subir el archivo Excel de cursos e insertar en la base de datos

    @PostMapping("/upload-courses")
    public ResponseEntity<String> uploadCoursesExcel(@RequestParam("file") MultipartFile file) {
        try {
            excelService.insertCourseExcelToDatabase(file);
            return ResponseEntity.status(HttpStatus.OK).body("Archivo de cursos subido y datos guardados correctamente!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo de cursos: " + e.getMessage());
        }
    }

    // Endpoint para obtener todos los expedientes desde la base de datos
    @GetMapping("/getAll")
    public List<Expedient> getAllExpedientes() {
        return excelService.getAllExpedientes();
    }
}
