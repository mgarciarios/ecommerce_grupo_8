package com.uade.tpo.e_commerce3.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.PedidoDTO;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.Pedido;
import com.uade.tpo.e_commerce3.model.Pedido.EstadoPedido;
import com.uade.tpo.e_commerce3.model.PedidoProducto;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.PedidoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public PedidoDTO crearPedido(Long idCarrito) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        List<ProductoCarrito> itemsCarrito = carrito.getProductos();
        if (itemsCarrito.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // Validar stock y decrementar antes de crear el pedido
        for (ProductoCarrito item : itemsCarrito) {
            Producto producto = item.getProducto();
            int cantidad = item.getCantidad_producto();
            if (producto.getStock() < cantidad) {
                throw new RuntimeException(
                        "Stock insuficiente para " + producto.getNombre() +
                        ". Disponible: " + producto.getStock() + ", solicitado: " + cantidad);
            }
            producto.setStock(producto.getStock() - cantidad);
            productoRepository.save(producto);
        }

        Pedido pedido = new Pedido();
        pedido.setUsuarioId(carrito.getUsuarioId());
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFechaPedido(LocalDateTime.now());

        for (ProductoCarrito item : itemsCarrito) {
            Producto producto = item.getProducto();
            PedidoProducto pp = new PedidoProducto();
            pp.setPedido(pedido);
            pp.setProductoId(producto.getId());
            pp.setNombreProducto(producto.getNombre());
            pp.setPrecioUnitario(producto.getPrecio());
            pp.setCantidad(item.getCantidad_producto());
            pedido.getItems().add(pp);
        }

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        return new PedidoDTO(pedidoGuardado);
    }

    public PedidoDTO getPedidoById(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + pedidoId));
        return new PedidoDTO(pedido);
    }

    public List<PedidoDTO> getPedidosByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId).stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }
}
