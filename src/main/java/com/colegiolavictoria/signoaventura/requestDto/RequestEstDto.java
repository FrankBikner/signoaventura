    package com.colegiolavictoria.signoaventura.requestDto;

    import java.time.LocalDate;

    import com.colegiolavictoria.signoaventura.modelos.Usuario;

  
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder

    public class RequestEstDto {

        
        private Usuario usuario;

        private LocalDate fechaIngreso; 

        private LocalDate  fechaNacimiento; 

        
    }
