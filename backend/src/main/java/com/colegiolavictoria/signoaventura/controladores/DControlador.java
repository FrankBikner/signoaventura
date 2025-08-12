package com.colegiolavictoria.signoaventura.controladores;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.colegiolavictoria.signoaventura.requestDto.RequestDctDto;
import com.colegiolavictoria.signoaventura.servicios.ServicioDct;

@Controller
@RequestMapping("/DControlador")
public class DControlador {
    private final ServicioDct servicioDct;

    public DControlador(ServicioDct servicioDct) {
        this.servicioDct = servicioDct;
    }

    @PostMapping(path = "/guardarDct")
    public ResponseEntity<RequestDctDto> guardarDct(@RequestBody RequestDctDto dct) {
       
        Optional<RequestDctDto> odct = Optional.of(dct); 
        if(odct.isPresent()){  
            this.servicioDct.guardarDct(dct);
            return ResponseEntity.ok().build();
    }else{
        return ResponseEntity.badRequest().build(); 
    }
    }

}
