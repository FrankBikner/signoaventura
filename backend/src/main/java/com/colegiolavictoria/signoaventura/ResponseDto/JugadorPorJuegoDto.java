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
public class JugadorPorJuegoDto {
    private int idProgreso;
    private String nombreEstudiante;
    private String apellidoEstudiante;
    private String emailEstudiante;
    private int puntuacion;
    private LocalTime tiempoJugado;
    private LocalDateTime fechaIntento;
    private String nombreJuego;
}
