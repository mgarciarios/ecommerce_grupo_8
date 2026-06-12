package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.PedidoDTO;
import com.uade.tpo.e_commerce3.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;


@GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoDTO>> getPedidosByUsuario(@PathVariable Long usuarioId) {
        List<PedidoDTO> pedidos = pedidoService.getPedidosByUsuarioId(usuarioId);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @GetMapping("/{pedidoId}")
    public ResponseEntity<PedidoDTO> getPedidoById(@PathVariable Long pedidoId) {
        PedidoDTO pedido = pedidoService.getPedidoById(pedidoId);
        return new ResponseEntity<>(pedido, HttpStatus.OK);
    }
}
