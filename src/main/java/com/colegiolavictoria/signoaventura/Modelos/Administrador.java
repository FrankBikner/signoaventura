package com.colegiolavictoria.signoaventura.Modelos;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "Administradores")
@Data //agrega getter y setters
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private int idAdmin; 

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion; 

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario; 

    
}
