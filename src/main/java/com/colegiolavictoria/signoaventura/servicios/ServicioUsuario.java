package com.colegiolavictoria.signoaventura.servicios;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.colegiolavictoria.signoaventura.modelos.Usuario;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioUsr;

@Service
public class ServicioUsuario {

    private final IRepositorioUsr repositorioUsr;
    private final PasswordEncoder passwordEncoder;

    public ServicioUsuario(IRepositorioUsr repositorioUsr, PasswordEncoder passwordEncoder) {
        this.repositorioUsr = repositorioUsr;
        this.passwordEncoder = passwordEncoder;
    }

     public boolean login(@PathVariable String  usuario, @PathVariable String contrasenia){
            Usuario u = repositorioUsr.findByUsuario(usuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 

            if(u == null || !passwordEncoder.matches(contrasenia, u.getContrasenia())) {

                return false; //contraseña incorrecta
            }
            return true; // Autenticación exitosa

    }

    public Usuario obtenerUsuario(String usuario) {
        return this.repositorioUsr.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    }



}
