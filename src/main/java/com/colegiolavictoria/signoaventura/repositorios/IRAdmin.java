package com.colegiolavictoria.signoaventura.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.colegiolavictoria.signoaventura.Modelos.Administrador;

public interface IRAdmin extends JpaRepository<Administrador, Integer>{

}
