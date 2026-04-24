package com.uade.tpo.e_commerce3.dto;

import com.uade.tpo.e_commerce3.model.ProductoCarrito;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCarritoDTO {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidad;
    private Double precioUnitario;

    public ProductoCarritoDTO(ProductoCarrito pc) {
        this.id = pc.getId();
        this.productoId = pc.getProducto().getId();
        this.nombreProducto = pc.getProducto().getNombre();
        this.cantidad = pc.getCantidad_producto();
        this.precioUnitario = pc.getProducto().getPrecio();
    }
}
