package com.sistemaExpedientes.sistExp.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        //setMatchingStrategy
        //setSkipNullEnabled
        return new ModelMapper();
    }
}
