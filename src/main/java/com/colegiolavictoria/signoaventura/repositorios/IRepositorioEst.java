package com.colegiolavictoria.signoaventura.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.modelos.Estudiante;

@Repository
public interface IRepositorioEst extends JpaRepository<Estudiante, Integer>{
   // public Optional<Estudiante> findByNombre(String nombre); 

    
    public Optional<Estudiante> findByUsuarioUsuario(String usuario);
 

    //public Optional<Estudiante> findByUsuario(String usuario); 
}
