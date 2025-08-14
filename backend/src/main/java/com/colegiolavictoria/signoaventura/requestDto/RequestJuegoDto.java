package com.colegiolavictoria.signoaventura.requestDto;

import com.colegiolavictoria.signoaventura.Modelos.Juego.NivelDificultad;
import com.colegiolavictoria.signoaventura.Modelos.Juego.Operador;

import lombok.Data;

@Data
public class RequestJuegoDto {

	private String nombreJuego;
	private String descripcion;
	private Operador operador;
	private NivelDificultad nivelDificultad;
	private Boolean activo;
	private String urlImagen;
	private String urlJuego;
}


