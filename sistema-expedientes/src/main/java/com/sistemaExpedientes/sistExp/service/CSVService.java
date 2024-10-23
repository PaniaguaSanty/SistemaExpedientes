package com.sistemaExpedientes.sistExp.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CSVService {

    @Autowired
    private ExpedientRepository expedientRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RegulationRepository regulationRepository;

    public void saveCSVData(MultipartFile file) throws IOException, CsvException {
        List<Expedient> expedientList = new ArrayList<>();

        // Leer el archivo CSV
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();

            // Iterar sobre las filas y convertirlas a objetos Expedient
            for (String[] row : rows) {
                // Crear un nuevo expediente para cada fila del CSV
                Expedient expedient = new Expedient();
                expedient.setIssuer(row[2]);
                expedient.setOrganizationCode(row[3]);
                expedient.setCorrelativeNumber(row[1]);
                expedient.setSolicitude(row[4]);
                expedient.setYear(row[6]);
                expedient.setStatus(row[5]);

                // Guardar el expediente
                Expedient savedExpedient = expedientRepository.save(expedient);

                // Crear y guardar la ubicación asociada al expediente
                Location location = new Location();
                location.setOrigin(row[3]);
                location.setDestiny(row[2]);
                location.setExpedient(savedExpedient); // Asociar la ubicación al expediente
                locationRepository.save(location); // Guardar la ubicación

                // Crear y guardar la resolución asociada al expediente
                Regulation regulation = new Regulation();
                regulation.setResolutionNumber(row[2]);
                //regulation.setStatus(Status.valueOf(row[11]));
                regulation.setExpedient(savedExpedient); // Asociar la resolución al expediente
                regulationRepository.save(regulation); // Guardar la resolución
            }
        }
    }
}
