package com.uade.tpo.e_commerce3.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "autores")
public class Autor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombre;
    private String nacionalidad;
    private String biografia;
    @OneToMany(mappedBy = "autor", fetch = FetchType.LAZY)
    private List<Libro> libros = new ArrayList<>();

    // Nueva relación ManyToMany con Editorial
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable( //innerjoin
        name = "autores_editoriales", // Nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "autor_id"), // Clave foránea de esta clase (Autor)
        inverseJoinColumns = @JoinColumn(name = "editorial_id") // Clave foránea de la otra clase (Editorial)
    )
    private List<Editorial> editoriales = new ArrayList<>();
}
