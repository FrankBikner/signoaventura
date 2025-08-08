package com.colegiolavictoria.signoaventura.ResponseDto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseEst {

    @NotBlank
    private String nombre; 
    
    @NotBlank
    private String apellido;
   
    @NotBlank
    private String usuario; 
    
    @NotBlank 
    private String email; 

    private boolean activo; 
    private LocalDate fechaIngreso;
    private LocalDate fechaNacimiento; // Nueva propiedad para la fecha de nacimiento
    private String rol; 


}
