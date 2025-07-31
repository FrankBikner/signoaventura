package com.colegiolavictoria.signoaventura.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.modelos.Juego;

@Repository
public interface IRepositorioJuego extends JpaRepository<Juego, Integer> {
    // Aquí puedes definir métodos específicos para manejar los juegos si es necesario
    // Por ejemplo, buscar juegos por nombre, categoría, etc.

}
