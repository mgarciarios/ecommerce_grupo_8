package com.uade.tpo.e_commerce.controller;
import com.uade.tpo.e_commerce.service.PedidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import com.uade.tpo.e_commerce.model.Pedidos;
import com.uade.tpo.e_commerce.model.Producto;


@RequestMapping("/api/pedidos")
public class PedidosController {
    @Autowired
    private PedidosService pedidosService;
    @GetMapping("/{DNI}")
    public Producto getPedidosByDNI(@PathVariable Long dni) {
        return pedidosService.getPedidosByDNI(dni);
    }
    @GetMapping
    public List<Pedidos> getAllPedidos() {
        return pedidosService.getAllPedidos();
    }
}
