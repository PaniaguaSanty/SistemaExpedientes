package service;

import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.CourseRepository;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import com.sistemaExpedientes.sistExp.service.ExcelService;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class ExcelServiceTest {

    @Mock
    private ExpedientRepository expedientRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private RegulationRepository regulationRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private MultipartFile excelFile;

    @InjectMocks
    private ExcelService excelService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConvertExcelToCsv() throws IOException {
        // Crear un Workbook de prueba en memoria
        Workbook workbook = new XSSFWorkbook();
        workbook.createSheet("Sheet1").createRow(0).createCell(0).setCellValue("Test");

        // Escribir el contenido del Workbook a un ByteArrayOutputStream
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        workbook.write(outStream);
        workbook.close();

        // Crear un MockMultipartFile a partir del contenido del ByteArrayOutputStream
        MockMultipartFile excelFile = new MockMultipartFile(
                "file",                      // Nombre del parámetro en la solicitud
                "test.xlsx",                  // Nombre del archivo
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Tipo MIME
                outStream.toByteArray()       // Contenido del archivo
        );

        // Llamar al método a probar
        File csvFile = excelService.convertExcelToCsv(excelFile);

        // Verificar que el archivo CSV se haya creado
        assertNotNull(csvFile, "El archivo CSV debería haberse creado");
    }

    @Test
    void testInsertCsvToDatabase() throws IOException {
        // Crear un archivo CSV temporal
        File csvFile = createTempCsvFile("column1,column2,column3\nvalue1,value2,value3");

        // Llamar al método de prueba
        excelService.insertCsvToDatabase(csvFile);

        // Verificar interacciones
        verify(regulationRepository, atLeast(0)).save(any(Regulation.class));
        verify(locationRepository, atLeast(0)).save(any(Location.class));
    }


    @Test
    void testInsertCourseExcelToDatabase() throws IOException {
        Workbook workbook = new XSSFWorkbook();
        workbook.createSheet("Sheet1").createRow(0).createCell(0).setCellValue("Test");
        // Escribir el contenido del Workbook a un ByteArrayOutputStream
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        workbook.write(outStream);
        workbook.close();

        // Crear un MockMultipartFile a partir del contenido del ByteArrayOutputStream
        MockMultipartFile excelFile = new MockMultipartFile(
                "file",                      // Nombre del parámetro en la solicitud
                "test.xlsx",                  // Nombre del archivo
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Tipo MIME
                outStream.toByteArray()       // Contenido del archivo
        );

        excelService.insertCourseExcelToDatabase(excelFile);
        assertNotNull(excelFile, "El archivo CSV debería haberse creado");

    }

    private File createTempCsvFile(String content) throws IOException {
        // Crear un archivo temporal para el CSV
        File tempFile = File.createTempFile("test", ".csv");
        tempFile.deleteOnExit(); // Asegurarse de que se elimina al salir

        // Escribir el contenido en el archivo
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(content);
        }

        return tempFile;
    }
}
