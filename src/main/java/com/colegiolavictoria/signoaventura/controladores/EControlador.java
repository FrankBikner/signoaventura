package com.colegiolavictoria.signoaventura.controladores;

import org.springframework.web.bind.annotation.RestController;

import com.colegiolavictoria.signoaventura.ResponseDto.ResponseEst;
import com.colegiolavictoria.signoaventura.requestDto.RequestEstDto;
import com.colegiolavictoria.signoaventura.servicios.ServicioEstudiante;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;








@RestController
@RequestMapping(path = "/EControlador")
public class EControlador{

    

    private final ServicioEstudiante servi;
    
    public EControlador(ServicioEstudiante _servi){
        this.servi = _servi; 
    }
    //obtiene un estudiante por id 
    @GetMapping(path = "/obtenerEst/{usuario}")
    public ResponseEntity<ResponseEst> getEstudianteByUser(@PathVariable String usuario) {
        Optional<ResponseEst> est = this.servi.getEstudiante(usuario); 

        if (est.isPresent()) {
            return ResponseEntity.ok(est.get()); 
        } else {
            return ResponseEntity.notFound().build(); 
        }
    }//fin de obtener Est.

    //guardamos el est
    @PostMapping(path = "/guardarEst")
    public ResponseEntity<RequestEstDto> guardarEst(@Validated @RequestBody RequestEstDto est){

        Optional<RequestEstDto> oest = Optional.of(est); 
        if(oest.isPresent()){
            this.servi.guardarEst(est);
            return ResponseEntity.ok().build(); 
        }else {
            return ResponseEntity.badRequest().build(); 
        }
        
    }//fin de guardar

    @GetMapping("/obtenerEstudiantes")
    public ResponseEntity<List<ResponseEst>> obtenerEstudiantes(){
        List<ResponseEst> listaEst = this.servi.obtenerEstudiantes(); 

        if(listaEst != null){
           return ResponseEntity.ok(listaEst); 
        }else{
            return ResponseEntity.notFound().build(); 
        }

    }
    
    
    
    
}
