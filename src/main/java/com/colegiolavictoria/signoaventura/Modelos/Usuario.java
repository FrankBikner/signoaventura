package com.colegiolavictoria.signoaventura.Modelos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Table(name = "Usuarios") //mapea la tabla 
@Entity //Mapea la entidad con respecto a al clase 
@Getter
@Setter
@Data
public class Usuario{

    @Id
    @Column(name ="id_usuario")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario; 

    @Column
    private String usuario;

    @Column
    private String contrasenia; 

    @Column
    private String nombre; 

    @Column
    private String apellido;

    @Column
    private String email;   
    
    @Column(name = "id_rol") 
    private int idRol; 

    /*@ManyToOne
    @JoinColumn(name = "id_rol") // Nombre del campo en la tabla "Usuarios"
    private Rol rol;*/


    
    
    
} 