package com.colegiolavictoria.signoaventura.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.colegiolavictoria.signoaventura.Modelos.Estudiante;

import jakarta.transaction.Transactional;

@Repository
public interface IRepositorioEst extends JpaRepository<Estudiante, Integer>{
   // public Optional<Estudiante> findByNombre(String nombre); 

    
    public Optional<Estudiante> findByUsuarioUsuario(String usuario); //busca el estudiante por el usuario 

      
    @Modifying
    @Transactional
    @Query("UPDATE Estudiante e SET e.usuario.activo = :estado WHERE e.usuario.usuario = :usuario")
    int setActivo(@Param("usuario") String usuario, 
                                   @Param("estado") boolean estado);

    
}
