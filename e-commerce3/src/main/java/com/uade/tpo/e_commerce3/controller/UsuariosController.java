package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {
    
        @Autowired
        private UsuarioService usuarioService;

         @GetMapping
        public List<Usuario> getAllUsuarios() {
            return usuarioService.getAllUsuarios();
        }

        @GetMapping("/{id}")
        public Usuario getUsuarioById(@PathVariable Long id) {
            return usuarioService.getUsuarioById(id);
        }

        @DeleteMapping("/{id}")
        public void deleteUsuarioById(@PathVariable Long id) {
            usuarioService.deleteUsuarioById(id);
        }

        @PostMapping
        public Usuario saveUsuario(@RequestBody Usuario usuario) {
            return usuarioService.saveUsuario(usuario);

        }
        
        @PutMapping("/{id}")
        public Usuario updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
            return usuarioService.updateUsuario(id, usuario);
        }


}
