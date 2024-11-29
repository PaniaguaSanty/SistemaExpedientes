package com.sistemaExpedientes.sistExp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequestDto {
    private String denominations;
    private String recipients;
    private String responsibleInstitutions;
    private String year;
}
