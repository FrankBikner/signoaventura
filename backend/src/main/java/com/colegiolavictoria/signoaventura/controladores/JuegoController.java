package com.colegiolavictoria.signoaventura.controladores;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.colegiolavictoria.signoaventura.Modelos.Juego;
import com.colegiolavictoria.signoaventura.requestDto.RequestJuegoDto;
import com.colegiolavictoria.signoaventura.servicios.ServicioJuego;

@RestController
@RequestMapping("/api/juegos")
public class JuegoController {

	private final ServicioJuego servicioJuego;

	public JuegoController(ServicioJuego servicioJuego) {
		this.servicioJuego = servicioJuego;
	}

	@GetMapping
	public ResponseEntity<List<Juego>> listar() {
		return ResponseEntity.ok(servicioJuego.listarJuegos());
	}

	@GetMapping(path = "/{id}")
	public ResponseEntity<Juego> obtener(@PathVariable int id) {
		return ResponseEntity.ok(servicioJuego.obtenerPorId(id));
	}

	@PostMapping
	public ResponseEntity<Juego> crear(@RequestBody RequestJuegoDto dto) {
		Juego creado = servicioJuego.crearJuego(dto);
		return ResponseEntity.ok(creado);
	}

	@PutMapping(path = "/{id}")
	public ResponseEntity<Juego> actualizar(@PathVariable int id, @RequestBody RequestJuegoDto dto) {
		Juego actualizado = servicioJuego.actualizarJuego(id, dto);
		return ResponseEntity.ok(actualizado);
	}

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable int id) {
		servicioJuego.eliminarJuego(id);
		return ResponseEntity.noContent().build();
	}
}


