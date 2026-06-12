package com.uade.tpo.e_commerce3.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Getter
@Setter
@ToString(exclude = {"categorias", "productosCarrito"})
@EqualsAndHashCode(exclude = {"categorias", "productosCarrito"})
@Entity
@Table(name = "productos")
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;    
    
    @Column(nullable = false)
    private Integer stock;

    private String foto;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "productos_categorias",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @JsonIgnoreProperties("productos") // Evita que la categoría intente serializar de nuevo sus productos en bucle
    private List<Categoria> categorias = new ArrayList<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("producto") // Evita que el elemento del carrito vuelva a renderizar el producto completo
    private List<ProductoCarrito> productosCarrito = new ArrayList<>();
}



