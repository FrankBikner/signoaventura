package com.colegiolavictoria.signoaventura.servicios;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.colegiolavictoria.signoaventura.Modelos.Usuario;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioUsr;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioEst;

@Service
public class ServicioUsuario {

    private final IRepositorioUsr repositorioUsr;
    private final IRepositorioEst repositorioEst;
    private final PasswordEncoder passwordEncoder;

    public ServicioUsuario(IRepositorioUsr repositorioUsr, IRepositorioEst repositorioEst, PasswordEncoder passwordEncoder) {
        this.repositorioUsr = repositorioUsr;
        this.repositorioEst = repositorioEst;
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

    public java.util.Map<String, Object> obtenerUsuarioConInfo(String usuario) {
        Usuario u = this.repositorioUsr.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
        userInfo.put("idUsuario", u.getIdUsuario());
        userInfo.put("usuario", u.getUsuario());
        userInfo.put("nombre", u.getNombre());
        userInfo.put("apellido", u.getApellido());
        userInfo.put("email", u.getEmail());
        userInfo.put("activo", u.getActivo());
        userInfo.put("rol", u.getRol());
        
        if (u.getRol() != null && "ESTUDIANTE".equals(u.getRol().getNombreRol().name())) {
            userInfo.put("esEstudiante", true);
            try {
                var estudiante = this.repositorioEst.findByUsuarioUsuario(usuario);
                if (estudiante.isPresent()) {
                    userInfo.put("idEstudiante", estudiante.get().getIdEstudiante());
                }
            } catch (Exception e) {
                // Si no se encuentra el estudiante, no agregar el ID
            }
        } else {
            userInfo.put("esEstudiante", false);
        }
        
        return userInfo;
    }

}
