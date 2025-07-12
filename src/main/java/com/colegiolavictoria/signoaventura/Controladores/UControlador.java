package com.colegiolavictoria.signoaventura.Controladores;

import org.springframework.web.bind.annotation.RestController;

import com.colegiolavictoria.signoaventura.Modelos.Usuario;
import com.colegiolavictoria.signoaventura.Servicios.servicioUsuario;

import org.springframework.web.bind.annotation.RequestMapping;


import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.ResponseBody;




@RestController
@RequestMapping(path = "/Ucontroler")
public class UControlador{
    private final servicioUsuario servi; 

    public UControlador(servicioUsuario servicio){
        this.servi = servicio; 
    }

    @GetMapping(path = "/usuario/{id}")
    @ResponseBody
    public Optional<Usuario> getMethodName(@PathVariable Integer id) {
        
        Optional<Usuario>op = servi.getUsuario(id); 
        System.out.println("antes if");
        if (op.isPresent()){
            Usuario user = op.get(); 
            System.out.println(user.getNombre());
        }
        return op;
    }
    
}
