package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    private final ExpedientRepository expedientRepository;
    private final LocationRepository locationRepository;
    private final RegulationRepository regulationRepository;

    public ExcelService(ExpedientRepository expedientRepository, LocationRepository locationRepository, RegulationRepository resolutionRepository) {
        this.expedientRepository = expedientRepository;
        this.locationRepository = locationRepository;
        this.regulationRepository = resolutionRepository;
    }

    // Método para convertir Excel a CSV
    public File convertExcelToCsv(MultipartFile excelFile) throws IOException {
        try (InputStream excelInputStream = excelFile.getInputStream();
             Workbook workbook = WorkbookFactory.create(excelInputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Archivo CSV temporal donde escribiremos los datos
            File csvFile = File.createTempFile("expedientes_", ".csv");
            try (PrintWriter writer = new PrintWriter(new FileWriter(csvFile))) {

                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();
                    Iterator<Cell> cellIterator = row.cellIterator();
                    StringBuilder csvRow = new StringBuilder();

                    while (cellIterator.hasNext()) {
                        Cell cell = cellIterator.next();
                        switch (cell.getCellType()) {
                            case STRING:
                                csvRow.append(cell.getStringCellValue());
                                break;
                            case NUMERIC:
                                csvRow.append((int) cell.getNumericCellValue());
                                break;
                            default:
                                csvRow.append("");
                                break;
                        }
                        if (cellIterator.hasNext()) {
                            csvRow.append(",");
                        }
                    }
                    writer.println(csvRow.toString());
                }
            }
            return csvFile;
        }
    }

    public void insertCsvToDatabase(File csvFile) throws IOException {
        List<Expedient> expedients = new ArrayList<>();
        List<String[]> csvData = new ArrayList<>(); // Para almacenar todas las líneas leídas del CSV
        int processedRows = 0; // Contador de filas procesadas

        // Leer el archivo CSV
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            // Saltar la primera línea (encabezado)
            reader.readLine();

            while ((line = reader.readLine()) != null) {
                line = line.trim(); // Limpiar espacios al inicio y al final

                // Se procesa cada línea, incluso si está vacía
                String[] values = line.split(","); // Separar por comas
                csvData.add(values); // Guardar las filas leídas en una lista

                // Crear y configurar el objeto Expedient
                Expedient expedient = new Expedient();
                expedient.setCorrelativeNumber(values.length > 3 ? values[3] : ""); // n correlativo
                expedient.setIssuer(values.length > 1 ? values[1] : ""); // iniciante
                expedient.setSolicitude(values.length > 6 ? values[6] : ""); // solicitud
                expedient.setYear(values.length > 4 ? values[4] : ""); // año

                // Agregar el Expedient a la lista
                expedients.add(expedient);
                processedRows++; // Incrementar el contador de filas procesadas
            }
        }

        System.out.println("Total de filas procesadas: " + processedRows); // Imprimir el total de filas procesadas

        // Guardar todos los expedientes
        if (!expedients.isEmpty()) {
            List<Expedient> savedExpedients = expedientRepository.saveAll(expedients);
            System.out.println("Total de expedientes guardados: " + savedExpedients.size());
        } else {
            System.out.println("No se encontraron expedientes para guardar.");
        }

        // Asociar regulaciones y ubicaciones
        for (int i = 0; i < expedients.size(); i++) {
            Expedient savedExpedient = expedients.get(i);
            String[] values = csvData.get(i); // Obtener los valores correspondientes a este expediente

            // Crear y guardar la regulación asociada al expediente
            Regulation regulation = new Regulation();
            regulation.setDescription("Descripción de la regulación para el expediente " + savedExpedient.getCorrelativeNumber());
            regulation.setExpedient(savedExpedient);
            regulationRepository.save(regulation);

            // Crear y guardar las ubicaciones asociadas al expediente
            for (int j = 7; j <= 14; j++) {
                if (j < values.length) { // Comprobar que el índice existe
                    Location location = new Location();
                    location.setPlace(values[j] != null ? values[j] : ""); // Ubicación o vacío
                    location.setExpedient(savedExpedient); // Asociar la ubicación al expediente
                    locationRepository.save(location); // Guardar la ubicación
                }
            }
        }
    }


    // Método para obtener todos los expedientes
    public List<Expedient> getAllExpedientes() {
        return expedientRepository.findAll();
    }

}
