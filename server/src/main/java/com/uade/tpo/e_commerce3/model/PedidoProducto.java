package com.uade.tpo.e_commerce3.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "pedido_producto")
public class PedidoProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pedido_producto_id")
    private Long pedidoProductoId;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @Column(nullable = false, name = "producto_id")
    private Long productoId;

    @Column(nullable = false, name = "nombre_producto")
    private String nombreProducto;

    @Column(nullable = false, name = "precio_unitario")
    private Double precioUnitario;

    @Column(nullable = false)
    private Integer cantidad;
}
