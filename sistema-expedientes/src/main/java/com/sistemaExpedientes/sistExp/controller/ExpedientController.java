package com.sistemaExpedientes.sistExp.controller;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.service.ExpedientService;
import com.sistemaExpedientes.sistExp.util.Controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/expedients")
@CrossOrigin(origins = "http://localhost:8080")
public class ExpedientController implements Controller<ExpedientResponseDTO, ExpedientRequestDTO> {

    private ExpedientService expedientService;

    public ExpedientController(ExpedientService expedientService) {
        this.expedientService = expedientService;
    }

    @Override
    @PostMapping("/create")
    public ResponseEntity<ExpedientResponseDTO> create(@RequestBody ExpedientRequestDTO expedientRequestDto) {
        ExpedientResponseDTO createdExp = expedientService.create(expedientRequestDto);
        return new ResponseEntity<>(createdExp, HttpStatus.CREATED);
    }

    @Override
    @PutMapping("/update")
    public ResponseEntity<ExpedientResponseDTO> update(@RequestBody ExpedientRequestDTO expedientRequestDto) {
        ExpedientResponseDTO updatedExp = expedientService.update(expedientRequestDto);
        return ResponseEntity.ok(updatedExp);    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        expedientService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ExpedientResponseDTO> findById(@PathVariable String id) {
        ExpedientResponseDTO expedient = expedientService.findOne(id);
        return ResponseEntity.ok(expedient);
    }

    @Override
    @GetMapping("/findAll")
    public ResponseEntity<List<ExpedientResponseDTO>> findAll() {
        List<ExpedientResponseDTO> expedients = expedientService.findAll();
        return ResponseEntity.ok(expedients);
    }

    // Buscar por código de organización
    @GetMapping("/organization/{orgCode}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByOrganizationCode(@PathVariable String orgCode) {
        List<ExpedientResponseDTO> expedients = expedientService.findByOrganizationCode(orgCode);
        return ResponseEntity.ok(expedients);
    }

    // Buscar por año
    @GetMapping("/year/{year}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByYear(@PathVariable String year) {
        List<ExpedientResponseDTO> expedients = expedientService.findByYear(year);
        return ResponseEntity.ok(expedients);
    }

    // Buscar por número correlativo
    @GetMapping("/correlative/{number}")
    public ResponseEntity<ExpedientResponseDTO> findByCorrelativeNumber(@PathVariable String number) {
        ExpedientResponseDTO expedient = expedientService.findByCorrelativeNumber(number);
        return ResponseEntity.ok(expedient);
    }

    // Buscar por emisor
    @GetMapping("/issuer/{issuer}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByIssuer(@PathVariable String issuer) {
        List<ExpedientResponseDTO> expedients = expedientService.findByIssuer(issuer);
        return ResponseEntity.ok(expedients);
    }

    // Buscar por tipo de solicitud
    @GetMapping("/solicitude/{solicitude}")
    public ResponseEntity<List<ExpedientResponseDTO>> findBySolicitude(@PathVariable String solicitude) {
        List<ExpedientResponseDTO> expedients = expedientService.findBySolicitude(solicitude);
        return ResponseEntity.ok(expedients);
    }

    // Buscar por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ExpedientResponseDTO>> findByStatus(@PathVariable String status) {
        List<ExpedientResponseDTO> expedients = expedientService.findByStatus(status);
        return ResponseEntity.ok(expedients);
    }
}
