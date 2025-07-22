package com.colegiolavictoria.signoaventura.repositorios;

import com.colegiolavictoria.signoaventura.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsuario(String usuario);
}
