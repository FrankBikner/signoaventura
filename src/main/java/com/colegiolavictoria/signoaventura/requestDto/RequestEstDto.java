package com.colegiolavictoria.signoaventura.requestDto;

import java.time.LocalDate;

import com.colegiolavictoria.signoaventura.modelos.ERol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RequestEstDto {
    
   
    private String usuario;
  
    private Boolean activo;
  
    private String contrasenia;

    private String nombre;
   
    private String apellido;
  
    private String email;

    private ERol rol;

    private LocalDate fechaNacimiento;
}
