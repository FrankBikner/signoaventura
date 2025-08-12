package com.colegiolavictoria.signoaventura.requestDto;

import java.time.LocalDate;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditDto{
    private String usuario;
  
    private String contrasenia;

    private String nombre;
   
    private String apellido;
  
    private String email;

    private LocalDate fechaNacimiento;

}
