package service;

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
import com.sistemaExpedientes.sistExp.service.ExpedientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExpedientServiceTest {

    @InjectMocks
    private ExpedientService expedientService;

    @Mock
    private ExpedientRepository expedientRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private RegulationRepository regulationRepository;

    @Mock
    private ExpedientMapper expedientMapper;

    @Mock
    private RegulationMapper regulationMapper;

    @Mock
    private LocationMapper locationMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        expedientRepository = mock(ExpedientRepository.class);
        locationRepository = mock(LocationRepository.class);
        locationMapper = mock(LocationMapper.class);
        expedientMapper = mock(ExpedientMapper.class);
        expedientService = new ExpedientService(expedientRepository, locationRepository, expedientMapper, locationMapper, regulationRepository, regulationMapper);
    }

    @Test
    void testCreate() {
        // Datos de prueba
        ExpedientRequestDTO requestDTO = new ExpedientRequestDTO();
        requestDTO.setIssuer("Issuer Test");
        requestDTO.setCorrelativeNumber("123456");

        Expedient expedient = new Expedient();
        expedient.setIssuer("Issuer Test");
        expedient.setCorrelativeNumber("123456");

        ExpedientResponseDTO responseDTO = new ExpedientResponseDTO();
        responseDTO.setIssuer("Issuer Test");
        responseDTO.setCorrelativeNumber("123456");

        // Configurar comportamiento de mocks
        when(expedientMapper.convertToEntity(requestDTO)).thenReturn(expedient);
        when(expedientRepository.save(expedient)).thenReturn(expedient);
        when(expedientMapper.convertToDto(expedient)).thenReturn(responseDTO);

        // Ejecutar el método que se está probando
        ExpedientResponseDTO createdDTO = expedientService.create(requestDTO);

        // Verificaciones
        assertEquals("Issuer Test", createdDTO.getIssuer());
        assertEquals("123456", createdDTO.getCorrelativeNumber());
        verify(expedientMapper, times(1)).convertToEntity(requestDTO);
        verify(expedientRepository, times(1)).save(expedient);
        verify(expedientMapper, times(1)).convertToDto(expedient);
    }


    @Test
    void testCreateThrowsNotFoundException() {
        // Datos de prueba
        ExpedientRequestDTO requestDTO = new ExpedientRequestDTO();
        requestDTO.setIssuer("Issuer Test");
        requestDTO.setCorrelativeNumber("123456");

        // Configurar comportamiento de mocks
        when(expedientMapper.convertToEntity(requestDTO)).thenThrow(new RuntimeException());

        // Verificar que se lanza la excepción
        assertThrows(NotFoundException.class, () -> expedientService.create(requestDTO));
    }


    @Test
    void update_ShouldReturnUpdatedExpedient_WhenExpedientExists() {
        // Arrange
        ExpedientRequestDTO requestDTO = new ExpedientRequestDTO();
        List<Regulation> regulations = new ArrayList<>();
        requestDTO.setCorrelativeNumber("12345");
        requestDTO.setIssuer("Issuer");
        requestDTO.setOrganizationCode("Org123");
        requestDTO.setSolicitude("Solicitude");
        requestDTO.setYear("2023");
        requestDTO.setRegulations(regulations);
        requestDTO.setPdfPath("/path/to/pdf");

        Expedient existingExpedient = new Expedient();
        existingExpedient.setCorrelativeNumber("12345");

        when(expedientRepository.findByCorrelativeNumber("12345")).thenReturn(existingExpedient);
        when(expedientRepository.save(any(Expedient.class))).thenReturn(existingExpedient);
        when(expedientMapper.convertToDto(existingExpedient)).thenReturn(new ExpedientResponseDTO());

        // Act
        ExpedientResponseDTO result = expedientService.update(requestDTO);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).save(existingExpedient);
    }

    @Test
    void update_ShouldThrowNotFoundException_WhenExpedientDoesNotExist() {
        // Arrange
        ExpedientRequestDTO requestDTO = new ExpedientRequestDTO();
        requestDTO.setCorrelativeNumber("12345");

        when(expedientRepository.findByCorrelativeNumber("12345")).thenReturn(null);

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> expedientService.update(requestDTO));
        assertEquals("Error while updating the expedient...", exception.getMessage());
    }

    @Test
    void delete_ShouldRemoveExpedient_WhenExpedientExists() {
        // Arrange
        Expedient expedient = new Expedient();
        when(expedientRepository.findById(anyLong())).thenReturn(Optional.of(expedient));

        // Act
        expedientService.delete("1");

        // Assert
        verify(expedientRepository).delete(expedient);
    }

    @Test
    void delete_ShouldThrowNotFoundException_WhenExpedientDoesNotExist() {
        // Arrange
        when(expedientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> expedientService.delete("1"));
        assertEquals("Expedient not found with the current ID...", exception.getMessage());
    }

    @Test
    void addLocation_ShouldAddLocation_WhenExpedientExists() {
        // Arrange
        Long expedientId = 1L;
        AddLocationRequestDto locationRequestDto = new AddLocationRequestDto();
        locationRequestDto.setPlace("New Location");

        String newPlace = "New Place";

        Expedient expedient = new Expedient();
        expedient.setLocations(new ArrayList<>());

        Location locationToAdd = new Location();
        when(expedientRepository.findById(expedientId)).thenReturn(Optional.of(expedient));
        when(locationMapper.convertAddedLocationToEntity(locationRequestDto)).thenReturn(locationToAdd);
        when(locationRepository.save(any(Location.class))).thenReturn(locationToAdd);
        when(locationMapper.convertAddedLocationToDto(locationToAdd)).thenReturn(new AddLocationResponseDto());

        // Act
        AddLocationResponseDto result = expedientService.addLocation(expedientId, locationRequestDto, newPlace);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).findById(expedientId);
        verify(locationMapper).convertAddedLocationToEntity(locationRequestDto);
        verify(locationRepository).save(locationToAdd);
        verify(locationMapper).convertAddedLocationToDto(locationToAdd);
    }

    @Test
    void addLocation_ShouldThrowNotFoundException_WhenExpedientDoesNotExist() {
        // Arrange
        AddLocationRequestDto locationRequestDto = new AddLocationRequestDto();
        String newPlace = "New Place";

        when(expedientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> expedientService.addLocation(1L, locationRequestDto, newPlace));
        assertEquals("Expedient not found with id: 1", exception.getMessage());
    }


    @Test
    void editLocation_ShouldUpdateLocation_WhenExpedientAndLocationExist() {
        // Arrange
        String existingPlace = "Old Location";
        AddLocationRequestDto locationDetails = new AddLocationRequestDto();
        locationDetails.setPlace("Updated Location");

        Expedient expedient = new Expedient();
        Location location = new Location();
        location.setPlace(existingPlace);

        when(expedientRepository.findById(anyLong())).thenReturn(Optional.of(expedient));
        when(locationRepository.findByPlace(existingPlace)).thenReturn(location);

        // Act
        AddLocationResponseDto result = expedientService.editLocation(1L, existingPlace, locationDetails);

        // Assert
        assertEquals("Updated Location", location.getPlace());
        verify(locationRepository).save(location);
    }

    @Test
    void editLocation_ShouldThrowNotFoundException_WhenExpedientDoesNotExist() {
        // Arrange
        String existingPlace = "Old Location";
        AddLocationRequestDto locationDetails = new AddLocationRequestDto();

        when(expedientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> expedientService.editLocation(1L, existingPlace, locationDetails));
        assertEquals("Expedient not found with ID 1", exception.getMessage());
    }

    @Test
    void findOne_ShouldReturnExpedientResponseDto_WhenExpedientExists() {
        // Arrange
        String id = "1";
        Expedient expedient = new Expedient();
        ExpedientResponseDTO expectedDto = new ExpedientResponseDTO();

        when(expedientRepository.findById(Long.valueOf(id))).thenReturn(Optional.of(expedient));
        when(expedientMapper.convertToDto(expedient)).thenReturn(expectedDto);

        // Act
        ExpedientResponseDTO result = expedientService.findOne(id);

        // Assert
        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(expedientRepository).findById(Long.valueOf(id));
        verify(expedientMapper).convertToDto(expedient);
    }

    @Test
    void findAll_ShouldReturnListOfExpedientResponseDto() {
        // Arrange
        List<Expedient> expedients = new ArrayList<>();
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientRepository.findAll()).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(expedientRepository).findAll();
    }

    @Test
    void findByOrganizationCode_ShouldReturnListOfExpedientResponseDto_WhenExpedientsExist() {
        // Arrange
        String orgCode = "ORG123";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient()); // Añadir un expedient para la prueba
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientRepository.findByOrganizationCode(orgCode)).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findByOrganizationCode(orgCode);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).findByOrganizationCode(orgCode);
    }

    @Test
    void findByYear_ShouldReturnListOfExpedientResponseDto_WhenExpedientsExist() {
        // Arrange
        String year = "2023";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient());
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findByYear(year);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(expedientRepository).findByYear(year);
    }

    @Test
    void findByCorrelativeNumber_ShouldReturnExpedientResponseDto_WhenExpedientExists() {
        // Arrange
        String number = "CORR123";
        Expedient expedient = new Expedient();
        ExpedientResponseDTO expectedDto = new ExpedientResponseDTO();

        when(expedientRepository.findByCorrelativeNumber(number)).thenReturn(expedient);
        when(expedientMapper.convertToDto(expedient)).thenReturn(expectedDto);

        // Act
        ExpedientResponseDTO result = expedientService.findByCorrelativeNumber(number);

        // Assert
        assertNotNull(result);
        assertEquals(expectedDto, result);
        verify(expedientRepository).findByCorrelativeNumber(number);
    }

    @Test
    void findByIssuer_ShouldReturnListOfExpedientResponseDto_WhenExpedientsExist() {
        // Arrange
        String issuer = "Issuer Name";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient());
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientRepository.findByIssuerIgnoreCase(issuer)).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findByIssuer(issuer);

        // Assert
        verify(expedientRepository).findByIssuerIgnoreCase(issuer);
    }

    @Test
    void findBySolicitude_ShouldReturnListOfExpedientResponseDto_WhenExpedientsExist() {
        // Arrange
        String solicitude = "Solicitud123";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient());
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientRepository.findBySolicitude(solicitude)).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findBySolicitude(solicitude);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).findBySolicitude(solicitude);
    }

    @Test
    void findByStatus_ShouldReturnListOfExpedientResponseDto_WhenExpedientsExist() {
        // Arrange
        String status = "Active";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient());
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();

        when(expedientRepository.findByStatus(status)).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(new ExpedientResponseDTO());

        // Act
        List<ExpedientResponseDTO> result = expedientService.findByStatus(status);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).findByStatus(status);
    }

    @Test
    void findByLocation_ShouldReturnListOfExpedientResponseDto_WhenExpedientsContainLocation() {
        // Arrange
        String locationName = "place"; // Definir el lugar correcto
        Location location = new Location();
        location.setPlace(locationName); // Asignar el lugar

        // Crear un expedient con una lista de ubicaciones que contiene el lugar deseado
        Expedient expedient = new Expedient();
        Location loc = new Location();
        loc.setPlace(locationName); // Asignar el lugar que coincide con la búsqueda
        expedient.setLocations(new ArrayList<>(List.of(loc))); // Añadir la ubicación

        List<Expedient> expedients = List.of(expedient);
        List<ExpedientResponseDTO> expectedDtos = new ArrayList<>();
        expectedDtos.add(new ExpedientResponseDTO()); // Añadir un DTO esperado si es necesario

        // Configurar los mocks
        when(expedientRepository.findAll()).thenReturn(expedients);
        when(expedientMapper.convertToDto(any(Expedient.class))).thenReturn(expectedDtos.get(0)); // Devolver el DTO esperado

        // Act
        List<ExpedientResponseDTO> result = expedientService.findByLocation(location.getPlace());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty()); // Asegurarse de que no esté vacío
        verify(expedientRepository).findAll(); // Verificar que se llame al repositorio
    }

    @Test
    void findRegulationsByIssuer_ShouldReturnListOfRegulationResponseDto_WhenRegulationsExist() {
        // Arrange
        String issuer = "Issuer Name";
        List<Regulation> regulations = new ArrayList<>();
        List<RegulationResponseDto> expectedDtos = new ArrayList<>();

        when(regulationRepository.findAll()).thenReturn(regulations);
        when(regulationMapper.convertToDto(any(Regulation.class))).thenReturn(new RegulationResponseDto());

        // Act
        List<RegulationResponseDto> result = expedientService.findRegulationsByIssuer(issuer);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(regulationRepository).findAll();
    }

    @Test
    void findSolicitudeByIssuer_ShouldReturnListOfSolicitudeDto_WhenExpedientsExist() {
        // Arrange
        String issuer = "Issuer Name";
        List<Expedient> expedients = new ArrayList<>();
        expedients.add(new Expedient());

        when(expedientRepository.findByIssuerIgnoreCase(issuer)).thenReturn(expedients);

        // Act
        List<SolicitudeDto> result = expedientService.findSolicitudeByIssuer(issuer);

        // Assert
        assertNotNull(result);
        verify(expedientRepository).findByIssuerIgnoreCase(issuer);
    }
}






