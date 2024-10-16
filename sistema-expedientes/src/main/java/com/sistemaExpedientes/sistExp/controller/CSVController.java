package com.sistemaExpedientes.sistExp.controller;

import com.opencsv.exceptions.CsvException;
import com.sistemaExpedientes.sistExp.service.CSVService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.io.IOException;

@RestController
@RequestMapping("/api/csv")
@CrossOrigin(origins = "http://localhost:8080")
public class CSVController {

    private CSVService csvService;

    public CSVController(CSVService csvService) {
        this.csvService = csvService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Por favor, sube un archivo CSV!");
        }

        try {
            csvService.saveCSVData(file);
            return ResponseEntity.status(HttpStatus.OK).body("Archivo subido y datos guardados correctamente!");
        } catch (IOException | CsvException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo: " + e.getMessage());
        }
    }

}