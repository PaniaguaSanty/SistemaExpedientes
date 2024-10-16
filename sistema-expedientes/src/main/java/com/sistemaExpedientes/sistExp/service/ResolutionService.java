package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.ResolutionRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.ResolutionResponseDto;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.ResolutionMapper;
import com.sistemaExpedientes.sistExp.model.Resolution;
import com.sistemaExpedientes.sistExp.repository.ResolutionRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Service
public class ResolutionService implements CRUD<ResolutionResponseDto, ResolutionRequestDto> {

    private final ResolutionRepository resolutionRepository;
    private final ResolutionMapper resolutionMapper;

    public ResolutionService(ResolutionRepository resolutionRepository, ResolutionMapper resolutionMapper) {
        this.resolutionRepository = resolutionRepository;
        this.resolutionMapper = resolutionMapper;
    }

    @Override
    public ResolutionResponseDto create(ResolutionRequestDto resolutionRequestDto) {
        try {
            Resolution resolution = resolutionMapper.convertToEntity(resolutionRequestDto);
            Resolution resolutionSaved = resolutionRepository.save(resolution);
            return resolutionMapper.convertToDto(resolutionSaved);
        } catch (Exception e) {
            throw new NotFoundException("Error while creating the resolution");
        }
    }

    @Override
    public ResolutionResponseDto update(ResolutionRequestDto resolutionRequestDto) {
        try {
            Resolution existingResolution = verifyResolution(resolutionRequestDto.getExpedientId());

            existingResolution.setDescription(resolutionRequestDto.getDescription());
            //existingResolution.setStatus(resolutionRequestDto.getStatus());

            Resolution updatedResolution = resolutionRepository.save(existingResolution);
            return resolutionMapper.convertToDto(updatedResolution);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while updating the resolution");
        }
    }

    public void delete(String id) {
        Resolution resolution = verifyResolution(Long.parseLong(id));
        resolutionRepository.delete(resolution);
    }

    public ResolutionResponseDto findOne(String id) {
        Resolution resolution = verifyResolution(Long.parseLong(id));
        return resolutionMapper.convertToDto(resolution);
    }

    public List<ResolutionResponseDto> findAll() {
        List<Resolution> resolutions = resolutionRepository.findAll();
        return resolutions.stream()
                .map(resolutionMapper::convertToDto)
                .collect(Collectors.toList());
    }

    private Resolution verifyResolution(Long id) {
        return resolutionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No existe una resolución con el ID " + id));
    }
}