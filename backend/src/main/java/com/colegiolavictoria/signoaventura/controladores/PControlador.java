package com.colegiolavictoria.signoaventura.controladores;


import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.colegiolavictoria.signoaventura.Modelos.Progreso;
import com.colegiolavictoria.signoaventura.requestDto.ProgresoDto;
import com.colegiolavictoria.signoaventura.servicios.ServicioProgreso;

@RestController
@RequestMapping(path = "api/pcontrolador")
public class PControlador {

    private final ServicioProgreso servicioProgreso;

    public PControlador(ServicioProgreso servicioReportes) {
        this.servicioProgreso = servicioReportes;
    }

    @GetMapping(path = "/obtenerProgreso/{usuario}")
    public ResponseEntity<Progreso> obtenerProgresoPorUsuario(@PathVariable String usuario) {
        
        Optional<Progreso> progreso = Optional.of(servicioProgreso.obtenerProgresoPorUsuario(usuario));

        return progreso
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build()); 

    }

    @PostMapping(path = "/guardarProgreso")
    public ResponseEntity<Progreso> guardarProgreso(@RequestBody ProgresoDto progreso) {
        Progreso progresoGuardado = this.servicioProgreso.actualizarOcrearProgreso(progreso);
        return ResponseEntity.ok(progresoGuardado);
    }

    @PostMapping(path = "/actualizarProgreso")
    public ResponseEntity<Progreso> actualizarProgreso(@RequestBody ProgresoDto progreso) {
        Progreso progresoActualizado = this.servicioProgreso.actualizarOcrearProgreso(progreso);
        return ResponseEntity.ok(progresoActualizado);
    }

    @GetMapping(path = "/progresos/{usuario}")
    public ResponseEntity<java.util.List<Progreso>> listarProgresosPorUsuario(@PathVariable String usuario) {
        java.util.List<Progreso> lista = this.servicioProgreso.listarProgresosPorUsuario(usuario);
        return ResponseEntity.ok(lista);
    }

    @GetMapping(path = "/progreso/{idEstudiante}/{idJuego}")
    public ResponseEntity<Progreso> obtenerProgresoPorEstudianteYJuego(@PathVariable int idEstudiante, @PathVariable int idJuego) {
        Progreso progreso = this.servicioProgreso.obtenerProgresoPorEstudianteYJuego(idEstudiante, idJuego);
        if (progreso != null) {
            return ResponseEntity.ok(progreso);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/progresos/{idEstudiante}/{idJuego}")
    public ResponseEntity<java.util.List<Progreso>> listarProgresosPorEstudianteYJuego(@PathVariable int idEstudiante, @PathVariable int idJuego) {
        java.util.List<Progreso> lista = this.servicioProgreso.listarProgresosPorEstudianteYJuego(idEstudiante, idJuego);
        return ResponseEntity.ok(lista);
    }

    
}
