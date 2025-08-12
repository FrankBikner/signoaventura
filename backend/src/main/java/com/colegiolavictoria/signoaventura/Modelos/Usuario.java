package com.colegiolavictoria.signoaventura.Modelos;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "Usuarios")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @Column(name = "id_usuario")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;

    @Column(unique = true)
    private String usuario;

    @Column
    private Boolean activo;

    @Column
    private String contrasenia;

    @Column
    private String nombre;

    @Column
    private String apellido;

    @Email
    @Column(unique = true)
    private String email;

    @ManyToOne(targetEntity = Rol.class, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_rol")
    private Rol rol;

    
}
