package service;

import com.sistemaExpedientes.sistExp.dto.request.RegulationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.RegulationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.RegulationMapper;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import com.sistemaExpedientes.sistExp.service.RegulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RegulationServiceTest {

    @Mock
    private RegulationMapper regulationMapper;

    @Mock
    private RegulationRepository regulationRepository;

    @InjectMocks
    private RegulationService regulationService;

    private RegulationRequestDto regulationRequestDto;
    private Regulation regulation;
    private RegulationResponseDto regulationResponseDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        regulationRequestDto = new RegulationRequestDto(); // Inicializa según tus necesidades
        regulation = new Regulation(); // Inicializa según tus necesidades
        regulationResponseDto = new RegulationResponseDto(); // Inicializa según tus necesidades
    }

    @Test
    void create_ShouldReturnRegulationResponseDto_WhenRegulationIsSaved() {
        // Arrange
        when(regulationMapper.convertToEntity(any(RegulationRequestDto.class))).thenReturn(regulation);
        when(regulationRepository.save(any(Regulation.class))).thenReturn(regulation);
        when(regulationMapper.convertToDto(any(Regulation.class))).thenReturn(regulationResponseDto);

        // Act
        RegulationResponseDto result = regulationService.create(regulationRequestDto);

        // Assert
        assertNotNull(result);
        verify(regulationMapper).convertToEntity(regulationRequestDto);
        verify(regulationRepository).save(regulation);
        verify(regulationMapper).convertToDto(regulation);
    }

    @Test
    void update_ShouldThrowNotFoundException_WhenRegulationDoesNotExist() {
        // Arrange
        Long id = 1L;
        regulationRequestDto.setExpedientId(id);
        when(regulationRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException thrown = assertThrows(NotFoundException.class, () -> regulationService.update(regulationRequestDto));
        assertEquals("Error while updating the resolution", thrown.getMessage());
    }

    @Test
    void delete_ShouldDeleteRegulation_WhenRegulationExists() {
        // Arrange
        String id = "1";
        when(regulationRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(regulation));

        // Act
        regulationService.delete(id);

        // Assert
        verify(regulationRepository).delete(regulation);
    }

    //falta unicamente testear el update

    @Test
    void delete_ShouldThrowNotFoundException_WhenRegulationDoesNotExist() {
        // Arrange
        String id = "1";
        when(regulationRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException thrown = assertThrows(NotFoundException.class, () -> regulationService.delete(id));
        assertEquals("No existe una resolución con el ID " + Long.parseLong(id), thrown.getMessage());
    }

    @Test
    void findOne_ShouldReturnRegulationResponseDto_WhenRegulationExists() {
        // Arrange
        String id = "1";
        when(regulationRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(regulation));
        when(regulationMapper.convertToDto(any(Regulation.class))).thenReturn(regulationResponseDto);

        // Act
        RegulationResponseDto result = regulationService.findOne(id);

        // Assert
        assertNotNull(result);
        verify(regulationRepository).findById(Long.parseLong(id));
        verify(regulationMapper).convertToDto(regulation);
    }

    @Test
    void findOne_ShouldThrowNotFoundException_WhenRegulationDoesNotExist() {
        // Arrange
        String id = "1";
        when(regulationRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException thrown = assertThrows(NotFoundException.class, () -> regulationService.findOne(id));
        assertEquals("No existe una resolución con el ID " + Long.parseLong(id), thrown.getMessage());
    }

    @Test
    void findAll_ShouldReturnListOfRegulationResponseDtos() {
        // Arrange
        when(regulationRepository.findAll()).thenReturn(Arrays.asList(regulation));
        when(regulationMapper.convertToDto(any(Regulation.class))).thenReturn(regulationResponseDto);

        // Act
        List<RegulationResponseDto> result = regulationService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regulationRepository).findAll();
    }
}
