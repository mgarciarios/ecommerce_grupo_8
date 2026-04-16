package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CarritoDTO;
import com.uade.tpo.e_commerce3.dto.ProductoCarritoDTO;
import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.model.Carrito;

import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.repository.ProductoCarritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoCarritoRepository productoCarritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<CarritoDTO> getAllCarritos() {
        return carritoRepository.findAll().stream()
                .map(CarritoDTO::new)
                .collect(Collectors.toList());
    }

    public CarritoDTO addProductoToCarrito(Long idCarrito, ProductoCarritoDTO nuevoProductoDTO) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        Producto producto = productoRepository.findById(nuevoProductoDTO.getProductoId())
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + nuevoProductoDTO.getProductoId()));

        ProductoCarrito item = carrito.getProductos().stream()
                .filter(p -> p.getProducto().getId().equals(producto.getId()))
                .findFirst()
                .orElse(null);

        if (item != null) {
            item.setCantidad(item.getCantidad() + nuevoProductoDTO.getCantidad());
        } else {
            item = new ProductoCarrito();
            item.setCarrito(carrito);
            item.setProducto(producto);
            item.setCantidad(nuevoProductoDTO.getCantidad());
            carrito.getProductos().add(item);
        }

        Carrito carritoGuardado = carritoRepository.save(carrito);
        
        return new CarritoDTO(carritoGuardado);
    }

    public void deleteProductoInCarritoById(Long idCarrito, Long idProducto) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        carrito.getProductos().removeIf(p -> p.getProducto().getId().equals(idProducto));
        carritoRepository.save(carrito);
    }

    public CarritoDTO getCarritoById(Long id) {
        Carrito carrito = carritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + id));
        
        return new CarritoDTO(carrito);
    }

    public Carrito saveCarrito(Carrito carrito){
        return carritoRepository.save(carrito);
    }

    public void deleteCarritoById(Long id){
        carritoRepository.deleteById(id);
    }

    public CarritoDTO vaciarCarritoById(Long idCarrito) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + idCarrito));

        carrito.getProductos().clear();
        Carrito carritoGuardado = carritoRepository.save(carrito);
        
        return new CarritoDTO(carritoGuardado);
    }

    public Carrito doCheckout(Long id){
        //TODO implementar doCheckout
        return null;
    }

}
