package com.sistemaExpedientes.sistExp.mapper;

import com.sistemaExpedientes.sistExp.dto.request.CourseRequestDto;
import com.sistemaExpedientes.sistExp.dto.response.CourseResponseDto;
import com.sistemaExpedientes.sistExp.model.Course;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


@Service
@Component
public class CourseMapper {

    private final ModelMapper modelMapper;

    public CourseMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public CourseResponseDto convertToDto(Course course) {
        return modelMapper.map(course, CourseResponseDto.class);
    }

    public Course convertToEntity(CourseRequestDto courseRequestDto) {
        return modelMapper.map(courseRequestDto, Course.class);
    }

}
