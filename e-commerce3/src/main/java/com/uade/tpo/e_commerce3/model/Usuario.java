package com.uade.tpo.e_commerce3.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
        @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombreUsuario;
    
    @Column(nullable = false)
    private String mail;
    
    @Column(nullable = false)
    private String contrasena;    
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String apellido;
}
