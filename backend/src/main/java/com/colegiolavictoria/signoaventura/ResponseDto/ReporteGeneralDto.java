package com.colegiolavictoria.signoaventura.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteGeneralDto {
    private int totalEstudiantes;
    private int totalJuegos;
    private int totalProgresos;
    private double puntuacionPromedio;
    private LocalTime tiempoPromedio;
}
