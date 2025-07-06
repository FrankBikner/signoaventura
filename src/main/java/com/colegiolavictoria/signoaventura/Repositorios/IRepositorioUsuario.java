package com.colegiolavictoria.signoaventura.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.Modelos.Usuario;

@Repository
public interface IRepositorioUsuario extends JpaRepository<Usuario, Integer>{

}
