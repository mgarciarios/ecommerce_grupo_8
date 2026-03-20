package com.uade.tpo.e_commerce.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.e_commerce.model.Pedidos;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @GetMapping()
    public String getAllUsuario() {
        return new String("Lista de usuarios");
    }

    
    
}
