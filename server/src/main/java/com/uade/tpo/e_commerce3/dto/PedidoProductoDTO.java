package com.uade.tpo.e_commerce3.dto;

import com.uade.tpo.e_commerce3.model.PedidoProducto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoProductoDTO {
    private Long pedidoProductoId;
    private Long productoId;
    private String nombreProducto;
    private Double precioUnitario;
    private Integer cantidad;

    public PedidoProductoDTO(PedidoProducto pp) {
        this.pedidoProductoId = pp.getPedidoProductoId();
        this.productoId = pp.getProductoId();
        this.nombreProducto = pp.getNombreProducto();
        this.precioUnitario = pp.getPrecioUnitario();
        this.cantidad = pp.getCantidad();
    }
}
