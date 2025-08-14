package com.colegiolavictoria.signoaventura.servicios;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.Modelos.Juego;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioJuego;
import com.colegiolavictoria.signoaventura.requestDto.RequestJuegoDto;

@Service
public class ServicioJuego {

	private final IRepositorioJuego repositorioJuego;

	public ServicioJuego(IRepositorioJuego repositorioJuego) {
		this.repositorioJuego = repositorioJuego;
	}

	public List<Juego> listarJuegos() {
		return repositorioJuego.findAll();
	}

	public Juego obtenerPorId(int idJuego) {
		return repositorioJuego.findById(idJuego)
			.orElseThrow(() -> new RuntimeException("Juego no encontrado"));
	}

	public Juego crearJuego(RequestJuegoDto dto) {
		Juego juego = new Juego();
		juego.setNombreJuego(dto.getNombreJuego());
		juego.setDescripcion(dto.getDescripcion());
		juego.setOperador(dto.getOperador());
		juego.setNivelDificultad(dto.getNivelDificultad());
		juego.setActivo(dto.getActivo() != null ? dto.getActivo() : Boolean.TRUE);
		juego.setUrlImagen(dto.getUrlImagen());
		juego.setUrlJuego(dto.getUrlJuego());
		juego.setFechaCreacion(LocalDateTime.now());
		return repositorioJuego.save(juego);
	}

	public Juego actualizarJuego(int idJuego, RequestJuegoDto dto) {
		Juego juego = obtenerPorId(idJuego);
		juego.setNombreJuego(dto.getNombreJuego());
		juego.setDescripcion(dto.getDescripcion());
		juego.setOperador(dto.getOperador());
		juego.setNivelDificultad(dto.getNivelDificultad());
		if (dto.getActivo() != null) {
			juego.setActivo(dto.getActivo());
		}
		juego.setUrlImagen(dto.getUrlImagen());
		juego.setUrlJuego(dto.getUrlJuego());
		return repositorioJuego.save(juego);
	}

	public void eliminarJuego(int idJuego) {
		repositorioJuego.deleteById(idJuego);
	}
}


