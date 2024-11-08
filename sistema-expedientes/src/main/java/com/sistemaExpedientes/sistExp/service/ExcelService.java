package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.model.Course;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.CourseRepository;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    private static final Logger logger = LoggerFactory.getLogger(ExcelService.class);
    private final ExpedientRepository expedientRepository;
    private final LocationRepository locationRepository;
    private final RegulationRepository regulationRepository;
    private final CourseRepository courseRepository;

    public ExcelService(ExpedientRepository expedientRepository, LocationRepository locationRepository, RegulationRepository regulationRepository, CourseRepository courseRepository) {
        this.expedientRepository = expedientRepository;
        this.locationRepository = locationRepository;
        this.regulationRepository = regulationRepository;
        this.courseRepository = courseRepository;
    }

    // Método para convertir Excel a CSV
    public File convertExcelToCsv(MultipartFile excelFile) throws IOException {
        try (InputStream excelInputStream = excelFile.getInputStream();
             Workbook workbook = WorkbookFactory.create(excelInputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            File csvFile = File.createTempFile("expedientes_", ".csv");
            try (PrintWriter writer = new PrintWriter(new FileWriter(csvFile))) {
                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();
                    StringBuilder csvRow = new StringBuilder();

                    // Asegurarse de procesar todas las columnas, incluso si están vacías
                    for (int i = 0; i < 15; i++) {  // 15 columnas fijas
                        Cell cell = row.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                        if (cell != null) {
                            switch (cell.getCellType()) {
                                case STRING:
                                    csvRow.append(cell.getStringCellValue().trim());
                                    break;
                                case NUMERIC:
                                    csvRow.append((int) cell.getNumericCellValue());
                                    break;
                                case BLANK:
                                    csvRow.append("");
                                    break;
                                default:
                                    csvRow.append("");
                                    break;
                            }
                        } else {
                            csvRow.append("");
                        }
                        if (i < 14) {  // No agregar coma después de la última columna
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
        List<String[]> csvData = new ArrayList<>();
        int processedRows = 0;

        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            reader.readLine(); // Saltar encabezado

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",", -1); // -1 para mantener campos vacíos
                csvData.add(values);

                // Crear expediente solo si hay datos válidos
                if (values.length >= 15) {  // Asegurarse de que hay suficientes columnas
                    Expedient expedient = new Expedient();

                    // Asignar valores según el orden correcto del Excel
                    // Solo asignar si el valor no está vacío
                    String codigo = values[0].trim();
                    String iniciante = values[1].trim();
                    String nroExpediente = values[2].trim();
                    String nroCorrelativo = values[3].trim();
                    String anio = values[4].trim();
                    String solicitud = values[6].trim();

                    expedient.setId(isValidLong(codigo) ? Long.valueOf(codigo) : null);    // Codigo
                    expedient.setIssuer(iniciante.isEmpty() ? null : iniciante);           // Iniciante
                    expedient.setOrganizationCode(nroExpediente.isEmpty() ? null : nroExpediente);   // N°Expediente
                    expedient.setCorrelativeNumber(nroCorrelativo.isEmpty() ? null : nroCorrelativo);  // N° Correlativo
                    expedient.setYear(anio.isEmpty() ? null : anio);                       // Año
                    expedient.setSolicitude(solicitud.isEmpty() ? null : solicitud);       // Solicitud

                    // Solo agregar si hay al menos algunos datos válidos
                    expedients.add(expedient);
                    processedRows++;
                }
            }
        }

        logger.info("Total rows proccesed: {}", processedRows);

        // Guardar expedientes válidos
        if (!expedients.isEmpty()) {
            List<Expedient> savedExpedients = expedientRepository.saveAll(expedients);
            logger.info("Total de expedientes guardados: " + savedExpedients.size());

            // Procesar regulaciones y ubicaciones
            for (int i = 0; i < expedients.size(); i++) {
                Expedient savedExpedient = expedients.get(i);
                String[] values = csvData.get(i);

                // Guardar regulación si existe
                if (values.length > 5 && !values[5].trim().isEmpty()) {
                    Regulation regulation = new Regulation();
                    regulation.setDescription(values[5].trim());  // Resolución
                    regulation.setExpedient(savedExpedient);
                    regulationRepository.save(regulation);
                }

                // Guardar ubicaciones si existen (columnas 7-14)
                for (int j = 7; j <= 14 && j < values.length; j++) {
                    String ubicacion = values[j].trim();
                    if (!ubicacion.isEmpty()) {
                        Location location = new Location();
                        location.setPlace(ubicacion);
                        location.setExpedient(savedExpedient);
                        locationRepository.save(location);
                    }
                }
            }
        } else {
            logger.info("No se encontraron expedientes válidos para guardar.");
        }
    }

    // Método para convertir un archivo de cursos de Excel a la base de datos
    public void insertCourseExcelToDatabase(MultipartFile excelFile) throws IOException {
        List<Course> courses = new ArrayList<>();

        try (InputStream inputStream = excelFile.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            // Iterar sobre todas las hojas del archivo Excel
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                String year = sheet.getSheetName(); // Ejemplo, "año 2021"
                Iterator<Row> rowIterator = sheet.iterator();
                rowIterator.next(); // Saltar la primera fila si es un encabezado

                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();
                    Course course = new Course();

                    // Columna 0 - Denominación
                    Cell denominationCell = row.getCell(0);
                    if (denominationCell != null && denominationCell.getCellType() == CellType.STRING) {
                        course.setDenominations(denominationCell.getStringCellValue());
                    } else {
                        course.setDenominations(""); // Valor predeterminado si está vacío
                    }

                    // Columna 1 - Destinatarios
                    Cell recipientsCell = row.getCell(1);
                    if (recipientsCell != null && recipientsCell.getCellType() == CellType.STRING) {
                        course.setRecipients(recipientsCell.getStringCellValue());
                    } else {
                        course.setRecipients(""); // Valor predeterminado si está vacío
                    }

                    // Columna 2 - Instituciones
                    Cell institutionsCell = row.getCell(2);
                    if (institutionsCell != null && institutionsCell.getCellType() == CellType.STRING) {
                        course.setResponsibleInstitutions(institutionsCell.getStringCellValue());
                    } else {
                        course.setResponsibleInstitutions(""); // Valor predeterminado si está vacío
                    }

                    course.setYear(year); // Esta línea establece el año antes de guardarla

                    // Verificar si el curso tiene al menos un campo lleno
                    if (!course.getDenominations().isEmpty() ||
                            !course.getRecipients().isEmpty() ||
                            !course.getResponsibleInstitutions().isEmpty()) {

                        courses.add(course); // Agregar solo si tiene al menos un campo no vacío
                    }
                }
            }
        }

        // Guardar todos los cursos
        if (!courses.isEmpty()) {
            courseRepository.saveAll(courses);
        }
    }



    private boolean isValidLong(String value) {
        if (value == null || value.trim().isEmpty()) {
            return false;
        }
        try {
            Long.parseLong(value.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public List<Expedient> getAllExpedientes() {
        return expedientRepository.findAll();
    }
}
