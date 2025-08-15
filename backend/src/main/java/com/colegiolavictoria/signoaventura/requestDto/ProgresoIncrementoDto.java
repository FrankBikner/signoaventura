package com.colegiolavictoria.signoaventura.requestDto;

import lombok.Data;

@Data
public class ProgresoIncrementoDto {
    private int idEstudiante;
    private int idJuego;
    private int puntosASumar;        // Puntos que se van a sumar al total
    private String tiempoAdicional;  // Tiempo adicional en formato HH:mm:ss
}
