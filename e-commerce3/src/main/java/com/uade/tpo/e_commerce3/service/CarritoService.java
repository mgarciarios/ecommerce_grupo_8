package com.uade.tpo.e_commerce3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.model.Carrito;

import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;

    public List<Carrito> getAllCarritos(){
        return carritoRepository.findAll();
    }

    public Carrito getCarritoById(Long id){
        //TODO implementar carritoDTO
        return carritoRepository.findById(id).orElse(null);
    }

    public Carrito saveCarrito(Carrito carrito){
        return carritoRepository.save(carrito);
    }

    public void deleteProductoInCarritoById(Long idCarrito, Long idProducto){
        //TODO implementar deleteProductoInCarritoById
    }

    public void deleteCarritoById(Long id){
        carritoRepository.deleteById(id);
    }

    public Carrito vaciarCarritoById(Long id){
        Carrito carrito = carritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con id: " + id));
        carrito.getProductos().clear();
        return carritoRepository.save(carrito);
    }

    public Carrito doCheckout(Long id){
        //TODO implementar doCheckout
        return null;
    }

    public Carrito addProductoToCarrito(Long idCarrito, ProductoCarrito nuevoProducto){
        //TODO implementar addProductoToCarrito
        return null;
    }




}
