package com.uade.tpo.e_commerce3.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.uade.tpo.e_commerce3.model.Pedido;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long pedidoId;
    private Long usuarioId;
    private String estado;
    private LocalDateTime fechaPedido;
    private LocalDateTime fechaRecepcion;
    private List<PedidoProductoDTO> items;
    private Double total;

    public PedidoDTO(Pedido pedido) {
        this.pedidoId = pedido.getPedidoId();
        this.usuarioId = pedido.getUsuarioId();
        this.estado = pedido.getEstado().name();
        this.fechaPedido = pedido.getFechaPedido();
        this.fechaRecepcion = pedido.getFechaRecepcion();

        this.items = pedido.getItems().stream()
                .map(PedidoProductoDTO::new)
                .collect(Collectors.toList());

        this.total = this.items.stream()
                .mapToDouble(item -> item.getPrecioUnitario() * item.getCantidad())
                .sum();
    }
}
