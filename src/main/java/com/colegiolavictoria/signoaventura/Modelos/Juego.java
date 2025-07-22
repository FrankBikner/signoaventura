package com.colegiolavictoria.signoaventura.modelos;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Juego {

    @Column(name = "id_juego")
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idJuego; 
    
    @Column(name = "nombre_juego")
    private String nombreJuego; 
    @Column
    private String descripcion; 
    @Column
    private char operador; 
    @Column(name = "nivel_dificultad")
    private String nivelDificultad; 
    @Column
    private Boolean activo;
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion; 


}
