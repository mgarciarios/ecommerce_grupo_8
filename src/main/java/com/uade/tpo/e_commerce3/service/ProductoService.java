package com.uade.tpo.e_commerce3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;

import jakarta.transaction.Transactional;

@Service //se encarga de las operaciones del negocio, si sale error cancela todo.
@Transactional
public class ProductoService {
 
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }
    public ProductoDTO getProductoById(Long id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) {
            throw new ProductoNotFoundException("Producto no encontrado con id: " + id );
        }
        ProductoDTO productoDTO = new ProductoDTO(producto.getId(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio());
        return productoDTO;
    }
    public void deleteProductoById(Long id) {
        productoRepository.deleteById(id);
    }
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }
   /*  public ProductoDTO updateProducto(Long id, ProductoDTO producto) {
        ProductoDTO existingProducto = getProductoById(id);
        if (existingProducto != null) {
            existingProducto.setNombre(producto.getNombre());
            existingProducto.setDescripcion(producto.getDescripcion());
            existingProducto.setPrecio(producto.getPrecio());
            return productoRepository.save(existingProducto);
        }
        return null;
    }*/
    public ProductoDTO updateProducto(Long id, ProductoDTO producto) {
    // 1. Buscamos la ENTIDAD, no el DTO (usamos findById directamente)
    Producto existingProducto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));
    // 2. Mapeamos los cambios del DTO a la ENTIDAD
    existingProducto.setNombre(producto.getNombre());
    existingProducto.setDescripcion(producto.getDescripcion());
    existingProducto.setPrecio(producto.getPrecio());
    // 3. Guardamos la ENTIDAD y la convertimos a DTO para devolverla
    Producto productoGuardado = productoRepository.save(existingProducto);
    return new ProductoDTO(
        productoGuardado.getId(), 
        productoGuardado.getNombre(), 
        productoGuardado.getDescripcion(), 
        productoGuardado.getPrecio()
    );}
}
