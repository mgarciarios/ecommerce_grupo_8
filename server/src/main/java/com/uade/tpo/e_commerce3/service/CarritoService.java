package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CarritoDTO;
import com.uade.tpo.e_commerce3.dto.PedidoDTO;
import com.uade.tpo.e_commerce3.dto.ProductoCarritoDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoCarritoRepository;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ProductoCarritoRepository productoCarritoRepository;

    private static final Logger log = LoggerFactory.getLogger(CarritoService.class);

    public List<CarritoDTO> getAllCarritos() {
        return carritoRepository.findAll().stream()
                .map(CarritoDTO::new)
                .collect(Collectors.toList());
    }

    public CarritoDTO addProductoToCarrito(Long idCarrito, ProductoCarritoDTO nuevoProductoDTO) {
        
        // buscar carrito por id
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));


        Integer cantidad = nuevoProductoDTO.getCantidad();
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad es obligatoria y debe ser mayor que 0");
        }
        
        // Buscar producto por id
        Producto producto = productoRepository.findById(nuevoProductoDTO.getProductoId())
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + nuevoProductoDTO.getProductoId()));

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }

        // Buscamos todos los registros que coincidan (por si la DB tenía duplicados corruptos)
        List<ProductoCarrito> itemsEnCarrito = carrito.getProductos().stream()
                .filter(p -> p.getProducto().getId().equals(producto.getId()))
                .collect(Collectors.toList());

        if (!itemsEnCarrito.isEmpty()) {
            ProductoCarrito itemPrincipal = itemsEnCarrito.get(0);
            
            // Lógica de AUTO-REPARACIÓN: Si hay filas duplicadas, unificamos las cantidades y borramos el resto
            if (itemsEnCarrito.size() > 1) {
                for (int i = 1; i < itemsEnCarrito.size(); i++) {
                    itemPrincipal.setCantidad_producto(itemPrincipal.getCantidad_producto() + itemsEnCarrito.get(i).getCantidad_producto());
                    carrito.getProductos().remove(itemsEnCarrito.get(i));
                    productoCarritoRepository.delete(itemsEnCarrito.get(i));
                }
            }

            // Validar que la cantidad total no supere el stock
            if (itemPrincipal.getCantidad_producto() + cantidad > producto.getStock()) {
                throw new RuntimeException("No hay suficiente stock");
            }
            itemPrincipal.setCantidad_producto(itemPrincipal.getCantidad_producto() + cantidad);
        } else {
            ProductoCarrito nuevoItem = new ProductoCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad_producto(cantidad);
            carrito.getProductos().add(nuevoItem);
        }

        Carrito carritoGuardado = carritoRepository.save(carrito);
        
        return new CarritoDTO(carritoGuardado);
    }

    // eliminar producto COMPLETO del carrito
    public CarritoDTO deleteProductoInCarritoById(Long idCarrito, Long idProducto) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));
        
        carrito.getProductos().removeIf(p -> p.getProducto().getId().equals(idProducto));
        
        Carrito carritoGuardado = carritoRepository.save(carrito);
        return new CarritoDTO(carritoGuardado);
    }

    // reducir cantidad de un producto en el carrito, si la cantidad a eliminar es igual a la que tiene, remover el item completamente
    public CarritoDTO reduceCantidadProductoInCarritoById(Long idCarrito, Long idProducto, Integer cantidad) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        ProductoCarrito item = carrito.getProductos().stream()
                .filter(p -> p.getProducto().getId().equals(idProducto))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));

        // Validar que no intente eliminar más de lo que tiene
        if (cantidad > item.getCantidad_producto()) {
            throw new RuntimeException("No puedes eliminar " + cantidad + " productos. El carrito solo tiene " + item.getCantidad_producto());
        }

        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad a eliminar debe ser mayor a 0");
        }

        // Si la cantidad a eliminar es igual a la que tiene, remover el item completamente
        if (cantidad.equals(item.getCantidad_producto())) {
            carrito.getProductos().remove(item);
        } else {
            // Si es menor, solo reducir la cantidad
            item.setCantidad_producto(item.getCantidad_producto() - cantidad);
        }

        Carrito carritoGuardado = carritoRepository.save(carrito);
        return new CarritoDTO(carritoGuardado);
    }

    public CarritoDTO getCarritoById(Long id) {
        Carrito carrito = carritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + id));
        
        return new CarritoDTO(carrito);
    }

    public Carrito saveCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    public void deleteCarritoById(Long id) {
        carritoRepository.deleteById(id);
    }

    public CarritoDTO vaciarCarritoById(Long idCarrito) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        carrito.getProductos().clear();
        Carrito carritoGuardado = carritoRepository.save(carrito);
        
        return new CarritoDTO(carritoGuardado);
    }

    public PedidoDTO doCheckout(Long idCarrito) {
        System.out.println("LA ID DEL CARRITO ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"+ idCarrito);
        log.info("doCheckout - iniciando con idCarrito: {}", idCarrito);
        PedidoDTO pedido = pedidoService.crearPedido(idCarrito);

        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));
        log.info("doCheckout - productos en carrito antes de limpiar: {}", carrito.getProductos().size());

        productoCarritoRepository.emptyByCarritoId(idCarrito);

        System.out.println("LA ID DEL CARRITO "+ idCarrito);

        return pedido;
    }

}
