package com.colegiolavictoria.signoaventura.servicios;

import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.Modelos.Estudiante;
import com.colegiolavictoria.signoaventura.Modelos.Juego;
import com.colegiolavictoria.signoaventura.Modelos.Progreso;
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

    public java.util.List<Progreso> listarProgresosPorUsuario(String usuario) {
        return this.repoProgreso.findAllByEstudianteUsuarioUsuario(usuario);
    }

    public Progreso obtenerProgresoPorEstudianteYJuego(int idEstudiante, int idJuego) {
        return this.repoProgreso.findByEstudianteIdEstudianteAndJuegoIdJuego(idEstudiante, idJuego);
    }

    public java.util.List<Progreso> listarProgresosPorEstudianteYJuego(int idEstudiante, int idJuego) {
        return this.repoProgreso.findAllByEstudianteIdEstudianteAndJuegoIdJuego(idEstudiante, idJuego);
    }

    public Progreso guardarProgreso(ProgresoDto progreso) {
        // Buscar progreso existente
        Progreso progresoExistente = this.repoProgreso.findByEstudianteIdEstudianteAndJuegoIdJuego(
            progreso.getIdEstudiante(), progreso.getIdJuego());
        
        if (progresoExistente != null) {
            // Actualizar progreso existente
            progresoExistente.setPuntuacion(progreso.getPuntuacion());
            progresoExistente.setFechaIntento(progreso.getFechaIntento());
            progresoExistente.setTiempoJugado(progreso.getTiempoJugado());
            return this.repoProgreso.save(progresoExistente);
        } else {
            // Crear nuevo progreso
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

    public Progreso actualizarOcrearProgreso(ProgresoDto progreso) {
        Progreso progresoExistente = this.repoProgreso.findByEstudianteIdEstudianteAndJuegoIdJuego(
            progreso.getIdEstudiante(), progreso.getIdJuego());
        
        if (progresoExistente != null) {
            progresoExistente.setPuntuacion(progresoExistente.getPuntuacion() + progreso.getPuntuacion());
            progresoExistente.setFechaIntento(progreso.getFechaIntento());

            java.time.LocalTime tiempoActual = progresoExistente.getTiempoJugado();
            java.time.LocalTime tiempoNuevo = progreso.getTiempoJugado();
            int segundosActual = tiempoActual.toSecondOfDay();
            int segundosNuevo = tiempoNuevo.toSecondOfDay();
            int sumaSegundos = segundosActual + segundosNuevo;

            java.time.LocalTime tiempoSumado = java.time.LocalTime.ofSecondOfDay(sumaSegundos % (24 * 3600));
            progresoExistente.setTiempoJugado(tiempoSumado);
            return this.repoProgreso.save(progresoExistente);
        } else {
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

}
