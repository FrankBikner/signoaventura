package com.colegiolavictoria.signoaventura.servicios;

import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.modelos.Estudiante;
import com.colegiolavictoria.signoaventura.modelos.Juego;
import com.colegiolavictoria.signoaventura.modelos.Progreso;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioEst;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioJuego;
import com.colegiolavictoria.signoaventura.repositorios.RProgreso;
import com.colegiolavictoria.signoaventura.requestDto.ProgresoDto;

@Service
public class ServicioProgreso {

    private final RProgreso repoProgreso;
    private final IRepositorioEst repoEstudiante;
    private final IRepositorioJuego repoJuego;

    public ServicioProgreso(RProgreso repoProgreso, IRepositorioEst repoEstudiante, IRepositorioJuego repoJuego) {
        this.repoProgreso = repoProgreso;
        this.repoEstudiante = repoEstudiante;
        this.repoJuego = repoJuego;
    }

    public Progreso obtenerProgresoPorUsuario(String usuario) {
        return this.repoProgreso.findByEstudianteUsuarioUsuario(usuario); 
    }

    public Progreso guardarProgreso(ProgresoDto progreso) {

        Estudiante e = this.repoEstudiante.findById(progreso.getIdEstudiante())
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        Juego j = this.repoJuego.findById(progreso.getIdJuego())
            .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        Progreso nuevoProgreso = Progreso.builder()
            .estudiante(e)
            .juego(j)
            .puntuacion(progreso.getPuntuacion())
            .fechaIntento(progreso.getFechaIntento())
            .tiempoJugado(progreso.getTiempoJugado())
            .build();
        return this.repoProgreso.save(nuevoProgreso);
    }



}
