package com.uade.tpo.e_commerce3.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}/favoritos")
public class FavoritosController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los productos favoritos de un usuario
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getFavoritos(@PathVariable Long usuarioId) {
        List<ProductoDTO> favoritos = usuarioService.getFavoritosByUsuario(usuarioId);
        return new ResponseEntity<>(favoritos, HttpStatus.OK);
    }

    // Agregar un producto a favoritos
    @PostMapping("/{productoId}")
    public ResponseEntity<Void> agregarAFavoritos(@PathVariable Long usuarioId, @PathVariable Long productoId) {
        usuarioService.agregarProductoAFavoritos(usuarioId, productoId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Eliminar un producto de favoritos
    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> eliminarDeFavoritos(@PathVariable Long usuarioId, @PathVariable Long productoId) {
        usuarioService.eliminarProductoDeFavoritos(usuarioId, productoId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}