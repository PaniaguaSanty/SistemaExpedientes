package com.sistemaExpedientes.sistExp.service;

import com.sistemaExpedientes.sistExp.dto.request.ExpedientRequestDTO;
import com.sistemaExpedientes.sistExp.dto.response.ExpedientResponseDTO;
import com.sistemaExpedientes.sistExp.exception.NotFoundException;
import com.sistemaExpedientes.sistExp.mapper.ExpedientMapper;
import com.sistemaExpedientes.sistExp.model.Expedient;
import com.sistemaExpedientes.sistExp.repository.ExpedientRepository;
import com.sistemaExpedientes.sistExp.util.CRUD;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Data
@Service
public class ExpedientService implements CRUD<ExpedientResponseDTO, ExpedientRequestDTO> {

    @Autowired
    private final ExpedientRepository expedientRepository;
    @Autowired
    private final ExpedientMapper expedientMapper;


    public ExpedientResponseDTO create(ExpedientRequestDTO expedientRequestDto) {
        try {
            Expedient expedient = expedientMapper.convertToEntity(expedientRequestDto);
            Expedient expedientSaved = expedientRepository.save(expedient);
            return expedientMapper.convertToDto(expedientSaved);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while creating the expedient");
        }
    }

    @Override
    public ExpedientResponseDTO update(ExpedientRequestDTO expedientRequestDto) {
        try {
            Expedient existingExpedient = verifyExpedient(expedientRequestDto.getId());

            existingExpedient.setIssuer(expedientRequestDto.getIssuer());
            existingExpedient.setStatus(expedientRequestDto.getStatus());
            existingExpedient.setYear(expedientRequestDto.getYear());
            existingExpedient.setCorrelativeNumber(expedientRequestDto.getCorrelativeNumber());
            existingExpedient.setOrganizationCode(expedientRequestDto.getOrganizationCode());
            existingExpedient.setSolicitude(expedientRequestDto.getSolicitude());

            Expedient updatedExpedient = expedientRepository.save(existingExpedient);
            return expedientMapper.convertToDto(updatedExpedient);
        } catch (NotFoundException e) {
            throw new NotFoundException("Error while updting the expedient");
        }
    }

    public void delete(String id) {
        Expedient expedient = verifyExpedient(Long.parseLong(id));
        expedientRepository.delete(expedient);
    }


    //buscar por id
    public ExpedientResponseDTO findOne(String id) {
        Expedient expedient = verifyExpedient(Long.parseLong(id));
        return expedientMapper.convertToDto(expedient);
    }

    //buscar por codigo de org.
    public List<ExpedientResponseDTO> findByOrganizationCode(String orgCode) {
       List<Expedient> expedients = expedientRepository.findByOrganizationCode(orgCode);
       return expedients.stream()
               .map(expedientMapper::convertToDto)
               .collect(Collectors.toList());
    }

    //buscar por año
    public List<ExpedientResponseDTO>findByYear(String year){
        List<Expedient> expedients = expedientRepository.findByYear(year);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por n° correlativo
    public ExpedientResponseDTO findByCorrelativeNumber(String number){
        Expedient expedient = expedientRepository.findByCorrelativeNumber(number);
        return expedientMapper.convertToDto(expedient);
    }

    //buscar por emisor
    public List<ExpedientResponseDTO> findByIssuer(String issuer){
        List<Expedient> expedients = expedientRepository.findByIssuer(issuer);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }
    //buscar por tipo de solicitud
    public List<ExpedientResponseDTO> findBySolicitude(String solicitude){
        List<Expedient> expedients = expedientRepository.findBySolicitude(solicitude);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    //buscar por estado
    public List<ExpedientResponseDTO> findByStatus(String status){
        List<Expedient> expedients = expedientRepository.findByStatus(status);
        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ExpedientResponseDTO> findAll() {
        List<Expedient> expedients = expedientRepository.findAll();

        return expedients.stream()
                .map(expedientMapper::convertToDto)
                .collect(Collectors.toList());
    }

    private Expedient verifyExpedient(Long id){
        return expedientRepository.findById(id).orElseThrow(()-> new NotFoundException("No existe un expediente con el ID " + id));
    }


}

