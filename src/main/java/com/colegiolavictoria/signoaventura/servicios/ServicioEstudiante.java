package com.colegiolavictoria.signoaventura.servicios;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.ResponseDto.ResponseEst;
import com.colegiolavictoria.signoaventura.modelos.Estudiante;
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


    //devuelve el Est por email (unico)
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
        String passwordEncode = passwordEncoder.encode(est.getUsuario().getContrasenia());
        est.getUsuario().setContrasenia(passwordEncode);

        // Guardar el estudiante con el usuario que ya tiene la contraseña encriptada
        this.repo.save(Estudiante.builder()
            .usuario(est.getUsuario())
            .fechaIngreso(est.getFechaIngreso())
            .fechaNacimiento(est.getFechaNacimiento())
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
                    .build()
                    ); 
                
                });
            return listResponse; 
        }else {
            return null; 
        }

        
    }


   
} 
