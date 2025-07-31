package com.colegiolavictoria.signoaventura.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.modelos.Progreso;

@Repository
public interface RProgreso extends JpaRepository<Progreso, Integer> {
        public Progreso findByEstudianteUsuarioUsuario(String usuario);
}
