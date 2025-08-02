package com.colegiolavictoria.signoaventura.repositorios;

import com.colegiolavictoria.signoaventura.modelos.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface IRepositorioUsr extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsuario(String usuario);
}
