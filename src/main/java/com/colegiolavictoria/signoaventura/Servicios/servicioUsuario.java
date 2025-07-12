package com.colegiolavictoria.signoaventura.Servicios;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.Modelos.Usuario;
import com.colegiolavictoria.signoaventura.Repositorios.IRepositorioUsuario;

@Service
public class servicioUsuario{
    private final IRepositorioUsuario repo;

    public servicioUsuario(IRepositorioUsuario r){
        this.repo = r; 

    }

    public Optional<Usuario> getUsuario(Integer id){
        System.out.println("numero filas" + repo.count());
        return repo.findById(id); 
    }


} 
