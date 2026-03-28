package com.uade.tpo.e_commerce3.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "editoriales") // Recomendación: usar minúscula para mantener el estándar en la base de datos
public class Editorial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String nacionalidad;
    @ManyToMany(mappedBy = "editoriales", fetch = FetchType.LAZY)
    private List<Autor> autores = new ArrayList<>();
}