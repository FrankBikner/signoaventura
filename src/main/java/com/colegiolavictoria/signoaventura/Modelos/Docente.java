package com.colegiolavictoria.signoaventura.modelos;

import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Table(name = "Docentes")
@Data //agrega los getters y setters 
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Docentes")
    private int idDocente; 

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario; 


}
