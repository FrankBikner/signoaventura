package com.colegiolavictoria.signoaventura.Modelos;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Juego {

    public enum NivelDificultad {
        FACIL, MEDIO, DIFICIL
    }
    
    public enum Operador {
        MENOR("<"), MAYOR(">"), IGUAL("=");
        
        private final String simbolo;
        
        Operador(String simbolo) {
            this.simbolo = simbolo;
        }
        
        public String getSimbolo() {
            return simbolo;
        }
    }

    @Column(name = "id_juego")
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idJuego; 
    
    @Column(name = "nombre_juego")
    private String nombreJuego; 
    @Column
    private String descripcion; 
    
    @Enumerated(EnumType.STRING)
    @Column
    private Operador operador; 
    
    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_dificultad")
    private NivelDificultad nivelDificultad; 
    
    @Column
    private Boolean activo;
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion; 

    @Column(name = "url_imagen")
    private String urlImagen; 

    @Column(name = "url_juego")
    private String urlJuego; 

    @Column(name = "concepto")
    private String concepto; 

}
