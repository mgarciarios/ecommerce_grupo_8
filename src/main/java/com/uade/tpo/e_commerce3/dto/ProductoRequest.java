package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

//Es cuando el cliente te manda que quiere crear o actualizar un producto
public class ProductoRequest {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Double stock;
}