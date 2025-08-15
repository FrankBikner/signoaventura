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
        Progreso nuevoProgreso = this.servicioProgreso.guardarProgreso(progreso);
        return ResponseEntity.ok(nuevoProgreso);
    }

    @GetMapping(path = "/progresos/{usuario}")
    public ResponseEntity<java.util.List<Progreso>> listarProgresosPorUsuario(@PathVariable String usuario) {
        java.util.List<Progreso> lista = this.servicioProgreso.listarProgresosPorUsuario(usuario);
        return ResponseEntity.ok(lista);
    }

    
}
