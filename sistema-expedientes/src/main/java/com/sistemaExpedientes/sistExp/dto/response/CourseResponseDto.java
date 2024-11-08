package com.sistemaExpedientes.sistExp.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponseDto {
    private Long id;
    private String denominations;
    private String recipients;
    private String responsibleInstitutions;
    private String year;
}
