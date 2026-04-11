package com.uade.tpo.e_commerce3.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.service.CarritoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/carrito")
public class CarritoController {
    
    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public List<Carrito> getAllCarritos() {
        return carritoService.getAllCarritos();
    }

    @GetMapping("/{id}")
    public Carrito getCarritoById(@PathVariable Long id) {
        return carritoService.getCarritoById(id);
    }

    @PostMapping
    public Carrito saveCarrito(@RequestBody Carrito carrito) {
        return carritoService.saveCarrito(carrito);
    }

    @DeleteMapping("/{idCarrito}/productos/{idProducto}")
    public void deleteProductoInCarritoById(@PathVariable Long idCarrito, @PathVariable Long idProducto) {
        carritoService.deleteProductoInCarritoById(idCarrito, idProducto);
    }

    @DeleteMapping("/{idCarrito}/productos")
    public Carrito vaciarCarrito(@PathVariable Long idCarrito) {
        return carritoService.vaciarCarritoById(idCarrito);
    }

    @PostMapping("/{id}/checkout")
    public Carrito doCheckout(@PathVariable Long id) {
        return carritoService.doCheckout(id);
    }

    @PostMapping("/{idCarrito}/productos")
    public Carrito addProductoToCarrito(@PathVariable Long idCarrito, @RequestBody ProductoCarrito nuevoProducto) {
        return carritoService.addProductoToCarrito(idCarrito, nuevoProducto);
    }
    
    
}
