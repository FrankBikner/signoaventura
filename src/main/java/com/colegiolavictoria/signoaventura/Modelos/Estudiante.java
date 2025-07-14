package com.colegiolavictoria.signoaventura.Modelos;

import java.time.LocalDate;

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
@Table
@Data

public class Estudiante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private int idEstudiante; 

    @Column
    private String grado;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso; 

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento; 

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario; 

}
