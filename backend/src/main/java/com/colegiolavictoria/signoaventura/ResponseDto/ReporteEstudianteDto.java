package com.colegiolavictoria.signoaventura.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteEstudianteDto {
    private int idEstudiante;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate fechaIngreso;
    private LocalDate fechaNacimiento;
    private int totalPuntuacion;
    private LocalTime tiempoTotal;
    private int cantidadJuegos;
    private double promedioPuntuacion;
}
