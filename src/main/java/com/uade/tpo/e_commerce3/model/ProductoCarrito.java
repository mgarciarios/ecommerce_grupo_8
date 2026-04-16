package com.uade.tpo.e_commerce3.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
public class ProductoCarrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Muchos "ítems" pueden pertenecer a un mismo Carrito
    @ManyToOne
    @JoinColumn(name = "carrito_id")
    private Carrito carrito;

    // Muchos "ítems" pueden referenciar al mismo Producto
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    // Cuántas unidades de este producto se agregaron
    private Integer cantidad;
}
