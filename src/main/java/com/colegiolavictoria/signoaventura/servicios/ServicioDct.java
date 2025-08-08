package com.colegiolavictoria.signoaventura.servicios;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.Modelos.Docente;
import com.colegiolavictoria.signoaventura.Modelos.ERol;
import com.colegiolavictoria.signoaventura.Modelos.Rol;
import com.colegiolavictoria.signoaventura.Modelos.Usuario;
import com.colegiolavictoria.signoaventura.repositorios.IRDct;
import com.colegiolavictoria.signoaventura.requestDto.RequestDctDto;

@Service
public class ServicioDct {

    public final IRDct repositorioDct;
    private final PasswordEncoder passwordEncoder;

    public ServicioDct(IRDct repositorioDct, PasswordEncoder passwordEncoder) {
        this.repositorioDct = repositorioDct;
        this.passwordEncoder = passwordEncoder;
    }

    public void guardarDct(RequestDctDto dct){

        String passwordEncode = passwordEncoder.encode(dct.getContrasenia());
        dct.setContrasenia(passwordEncode);
        this.repositorioDct.save(
            Docente.builder()
            .usuario(
                Usuario.builder()
                .usuario(dct.getUsuario())
                .email(dct.getEmail())
                .contrasenia(dct.getContrasenia())
                .nombre(dct.getNombre())
                .apellido(dct.getApellido())
                .rol(Rol.builder().nombreRol(ERol.DOCENTE).build())
                .activo(dct.getActivo())
                .build()
            )
            .build()
        );

    }

}
