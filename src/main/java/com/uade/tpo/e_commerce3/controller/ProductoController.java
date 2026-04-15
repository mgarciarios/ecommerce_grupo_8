package com.uade.tpo.e_commerce3.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.service.ProductoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
// para acceder a este controlador, la URL base será /api/productos
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    //http://localhost:8080/api/productos -> devuelve la lista de productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    //http://localhost:8080/api/productos/1 -> devuelve el producto con id 1
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getProductoById(@PathVariable Long id) {
        ProductoDTO productoDTO = productoService.getProductoById(id);

        // Se crea una nueva instancia de ResponseEntity, pasando el producto encontrado como cuerpo de la respuesta
        // y HttpStatus.OK (código 200) como estado de la respuesta.

        //ResponseEntity es una clase que representa toda la respuesta HTTP: código de estado, encabezados y cuerpo.
        //devuelve una promesa en el cuerpo los datos del producto, y un codigo de estado 200 (OK)
        // el cuerpo es un json productos -> json
        //TODO: ssanchez - devolver en todos los enpoints ResponseEntity con DTO correspondiente
        return new ResponseEntity<ProductoDTO>(productoDTO, HttpStatus.OK);
    }

    // del http://localhost:8080/api/productos/1 -> elimina el producto con id 1
    @DeleteMapping("/{id}")
    public void deleteProductoById(@PathVariable Long id) {
        productoService.deleteProductoById(id);
    }

    @PostMapping
    public Producto saveProducto(@RequestBody Producto producto) {
        return productoService.saveProducto(producto);

    }
    
    @PutMapping("/{id}")
    public ProductoDTO udpateProducto(@PathVariable Long id, @RequestBody ProductoDTO producto) {
        return productoService.updateProducto(id, producto);
    }
    
    
}
