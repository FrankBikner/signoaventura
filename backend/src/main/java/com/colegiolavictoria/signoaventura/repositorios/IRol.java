package com.colegiolavictoria.signoaventura.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.colegiolavictoria.signoaventura.Modelos.ERol;
import com.colegiolavictoria.signoaventura.Modelos.Rol;

public interface IRol extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombreRol(ERol nombreRol);
}


