package com.colegiolavictoria.signoaventura.requestDto;



import com.colegiolavictoria.signoaventura.modelos.ERol;

import lombok.Data;

@Data
public class RequestDctDto {

    private String usuario;
  
    private Boolean activo;
  
    private String contrasenia;

    private String nombre;
   
    private String apellido;
  
    private String email;

    private ERol rol;

}
