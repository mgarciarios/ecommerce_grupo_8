package com.uade.tpo.e_commerce3.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String foto;
    private List<String> categorias;

    public ProductoDTO(Long id, String nombre, String descripcion, Double precio, Integer stock, String foto, List<String> categorias) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.foto = foto;
        this.categorias = categorias;
    }

}
