package com.colegiolavictoria.signoaventura.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.Modelos.Progreso;

@Repository
public interface RProgreso extends JpaRepository<Progreso, Integer> {
        public Progreso findByEstudianteUsuarioUsuario(String usuario);
        public java.util.List<Progreso> findAllByEstudianteUsuarioUsuario(String usuario);
        public Progreso findByEstudianteIdEstudianteAndJuegoIdJuego(int idEstudiante, int idJuego);
        public java.util.List<Progreso> findAllByEstudianteIdEstudianteAndJuegoIdJuego(int idEstudiante, int idJuego);
}
