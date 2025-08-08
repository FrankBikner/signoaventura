package com.colegiolavictoria.signoaventura.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.colegiolavictoria.signoaventura.modelos.Usuario;


public interface IRepositorioUsr extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsuario(String usuario);
}
