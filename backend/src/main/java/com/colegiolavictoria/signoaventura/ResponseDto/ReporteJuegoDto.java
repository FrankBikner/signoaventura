package com.colegiolavictoria.signoaventura.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteJuegoDto {
    private int idJuego;
    private String nombreJuego;
    private String descripcion;
    private String concepto;
    private String nivelDificultad;
    private String operador;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private int totalJugadores;
    private double puntuacionPromedio;
    private LocalTime tiempoPromedio;
}
