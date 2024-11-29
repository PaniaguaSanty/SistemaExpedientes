package service;

import com.sistemaExpedientes.sistExp.dto.request.LocationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.LocationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.LocationMapper;
import com.sistemaExpedientes.sistExp.model.Location;
import com.sistemaExpedientes.sistExp.repository.LocationRepository;
import com.sistemaExpedientes.sistExp.service.LocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LocationServiceTest {

    @Mock
    private LocationMapper locationMapper;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationService locationService;

    private LocationRequestDto locationRequestDto;
    private Location location;
    private LocationResponseDto locationResponseDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        locationRequestDto = new LocationRequestDto(); // Asegúrate de inicializarlo correctamente
        location = new Location();
        locationResponseDto = new LocationResponseDto(); // Asegúrate de inicializarlo correctamente
    }

    @Test
    void create_ShouldReturnLocationResponseDto_WhenLocationIsSaved() {
        // Arrange
        when(locationMapper.convertToEntity(any(LocationRequestDto.class))).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(locationMapper.convertToDto(any(Location.class))).thenReturn(locationResponseDto);

        // Act
        LocationResponseDto result = locationService.create(locationRequestDto);

        // Assert
        assertNotNull(result);
        verify(locationMapper).convertToEntity(locationRequestDto);
        verify(locationRepository).save(location);
        verify(locationMapper).convertToDto(location);
    }

    @Test
    void update_ShouldReturnLocationResponseDto_WhenLocationExists() {
        // Arrange
        Long id = 1L;
        when(locationRepository.findById(id)).thenReturn(Optional.of(location));
        when(locationMapper.convertToDto(any(Location.class))).thenReturn(locationResponseDto);

        // Act
        LocationResponseDto result = locationService.update(id, locationRequestDto);

        // Assert
        assertNotNull(result);
        verify(locationRepository).findById(id);
        verify(locationMapper).convertToDto(location);
    }


    @Test
    void delete_ShouldDeleteLocation_WhenLocationExists() {
        // Arrange
        String id = "1";
        when(locationRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(location));

        // Act
        locationService.delete(id);

        // Assert
        verify(locationRepository).delete(location);
    }

    @Test
    void delete_ShouldThrowNotFoundException_WhenLocationDoesNotExist() {
        // Arrange
        String id = "1";
        when(locationRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException thrown = assertThrows(NotFoundException.class, () -> locationService.delete(id));
        assertEquals("No existe un expediente con el ID " + Long.parseLong(id), thrown.getMessage());
    }

    @Test
    void findOne_ShouldReturnLocationResponseDto_WhenLocationExists() {
        // Arrange
        String id = "1";
        when(locationRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(location));
        when(locationMapper.convertToDto(any(Location.class))).thenReturn(locationResponseDto);

        // Act
        LocationResponseDto result = locationService.findOne(id);

        // Assert
        assertNotNull(result);
        verify(locationRepository).findById(Long.parseLong(id));
        verify(locationMapper).convertToDto(location);
    }

    @Test
    void findOne_ShouldThrowNotFoundException_WhenLocationDoesNotExist() {
        // Arrange
        String id = "1";
        when(locationRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException thrown = assertThrows(NotFoundException.class, () -> locationService.findOne(id));
        assertEquals("No existe un expediente con el ID " + Long.parseLong(id), thrown.getMessage());
    }
}
