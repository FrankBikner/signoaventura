package com.colegiolavictoria.signoaventura.servicios;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.ResponseDto.ResponseEst;
import com.colegiolavictoria.signoaventura.modelos.ERol;
import com.colegiolavictoria.signoaventura.modelos.Estudiante;
import com.colegiolavictoria.signoaventura.modelos.Rol;
import com.colegiolavictoria.signoaventura.modelos.Usuario;
import com.colegiolavictoria.signoaventura.repositorios.IRepositorioEst;
import com.colegiolavictoria.signoaventura.requestDto.RequestEstDto;

@Service
public class ServicioEstudiante{
    private final IRepositorioEst repo;
    private final PasswordEncoder passwordEncoder; 

   public ServicioEstudiante(IRepositorioEst r, PasswordEncoder passwordEncoder) {
        this.repo = r;
        this.passwordEncoder = passwordEncoder;
    }   


    //devuelve el Est por usua (unico)
    public Optional<ResponseEst> getEstudiante(String usuario){
        Optional<Estudiante> est  = this.repo.findByUsuarioUsuario(usuario); 

        if(est.isPresent()){
            ResponseEst estudiante = ResponseEst.builder()
                .nombre(est.get().getUsuario().getNombre())
                .apellido(est.get().getUsuario().getApellido())
                .build();
                return Optional.of(estudiante);  
        }
        return Optional.empty(); //no existe dicho registro devuelve vacio

    }//fin 

    //guarda un nuevo estudiente
    public void guardarEst(RequestEstDto est) {
    // Encriptar la contraseña directamente
        String passwordEncode = passwordEncoder.encode(est.getContrasenia());
        est.setContrasenia(passwordEncode);

        est.getRol();
        // Guardar el estudiante con el usuario que ya tiene la contraseña encriptada
        this.repo.save(
            Estudiante.builder()
            .usuario(
                Usuario.builder()
                .usuario(est.getUsuario())
                .email(est.getEmail())
                .nombre(est.getNombre())
                .activo(est.getActivo())
                .apellido(est.getApellido())
                .contrasenia(est.getContrasenia())
                .rol(Rol.builder()
                    .nombreRol(ERol.ESTUDIANTE).
                    build())
                .build()
                )
            .fechaNacimiento(est.getFechaNacimiento())
            .fechaIngreso(LocalDate.now())
            .build()
            );
    }

    public List<ResponseEst> obtenerEstudiantes(){
        List<Estudiante> listaEst = this.repo.findAll(); 

        if(!listaEst.isEmpty()){
            List<ResponseEst> listResponse = new ArrayList<>(); 

            listaEst.stream()
                .forEach(est -> {
                    listResponse.add(ResponseEst.builder()
                    .nombre(est.getUsuario().getNombre())
                    .apellido(est.getUsuario().getApellido())
                    .usuario(est.getUsuario().getUsuario())
                    .email(est.getUsuario().getEmail())
                    .fechaIngreso(est.getFechaIngreso())
                    .activo(est.getUsuario().getActivo())
                    .build()
                    ); 
                
                });
            return listResponse; 
        }else {
            return null; 
        }

        
    }

    public int  estadoEst(String usuario, boolean estado){
     
        Optional<Estudiante> est = this.repo.findByUsuarioUsuario(usuario); 

        if(est.isPresent()){

           return this.repo.setActivo(usuario, estado); //numero de filas afectadasecurityConfig

        }else {
            return 0; 
        }
    }


   
} 
