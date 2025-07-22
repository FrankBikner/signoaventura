package com.colegiolavictoria.signoaventura.modelos;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Estudiante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private int idEstudiante; 

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso; 

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento; 

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario; 

}
