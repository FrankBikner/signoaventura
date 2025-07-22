package com.colegiolavictoria.signoaventura.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.colegiolavictoria.signoaventura.modelos.Progreso;

public interface RProgreso extends JpaRepository<Progreso, Integer> {
        
}
