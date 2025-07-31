package com.colegiolavictoria.signoaventura.requestDto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Data;


@Data
public class ProgresoDto {

    private int idEstudiante;
    private int idJuego;
    private int puntuacion;
    private LocalDateTime fechaIntento;
    private LocalTime tiempoJugado;

    
}
