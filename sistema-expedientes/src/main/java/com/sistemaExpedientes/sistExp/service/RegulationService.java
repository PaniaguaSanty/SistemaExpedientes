package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.RegulationRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.RegulationResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.RegulationMapper;
import com.sistemaExpedientes.sistExp.model.Regulation;
import com.sistemaExpedientes.sistExp.repository.RegulationRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Service
public class RegulationService implements CRUD<RegulationResponseDto, RegulationRequestDto> {

    private final RegulationRepository resolutionRepository;
    private final RegulationMapper resolutionMapper;

    public RegulationService(RegulationRepository resolutionRepository, RegulationMapper resolutionMapper) {
        this.resolutionRepository = resolutionRepository;
        this.resolutionMapper = resolutionMapper;
    }

    @Override
    public RegulationResponseDto create(RegulationRequestDto resolutionRequestDto) {
        try {
            Regulation resolution = resolutionMapper.convertToEntity(resolutionRequestDto);
            Regulation resolutionSaved = resolutionRepository.save(resolution);
            return resolutionMapper.convertToDto(resolutionSaved);
        } catch (Exception e) {
            throw new NotFoundException("Error while creating the resolution");
        }
    }

    @Override
    public RegulationResponseDto update(RegulationRequestDto resolutionRequestDto) {
        try {
            Regulation existingRegulation = verifyRegulation(resolutionRequestDto.getExpedientId());

            existingRegulation.setDescription(resolutionRequestDto.getDescription());
            //existingRegulation.setStatus(resolutionRequestDto.getStatus());

            Regulation updatedRegulation = resolutionRepository.save(existingRegulation);
            return resolutionMapper.convertToDto(updatedRegulation);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while updating the resolution");
        }
    }

    public void delete(String id) {
        Regulation resolution = verifyRegulation(Long.parseLong(id));
        resolutionRepository.delete(resolution);
    }

    public RegulationResponseDto findOne(String id) {
        Regulation resolution = verifyRegulation(Long.parseLong(id));
        return resolutionMapper.convertToDto(resolution);
    }

    public List<RegulationResponseDto> findAll() {
        List<Regulation> resolutions = resolutionRepository.findAll();
        return resolutions.stream()
                .map(resolutionMapper::convertToDto)
                .collect(Collectors.toList());
    }

    private Regulation verifyRegulation(Long id) {
        return resolutionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No existe una resolución con el ID " + id));
    }
}