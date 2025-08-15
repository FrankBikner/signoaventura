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
public class ReporteDetalladoDto {
    private int totalEstudiantes;
    private int totalJuegos;
    private int totalProgresos;
    private double puntuacionPromedio;
    private LocalTime tiempoPromedio;
    private int puntuacionMaxima;
    private int puntuacionMinima;
    private LocalTime tiempoTotal;
}
