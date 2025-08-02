package com.colegiolavictoria.signoaventura.controladores;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.colegiolavictoria.signoaventura.servicios.ServicioUsuario;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ServicioUsuario servicioUsuario;


    public AuthController(ServicioUsuario servicioUsuario) {
        this.servicioUsuario = servicioUsuario;
    }

    @GetMapping("/login/{usuario}/{contrasenia}")
    public ResponseEntity<Boolean> login(@PathVariable String  usuario, @PathVariable String contrasenia){
        
        if(servicioUsuario.login(usuario, contrasenia)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }


    }

    
}
