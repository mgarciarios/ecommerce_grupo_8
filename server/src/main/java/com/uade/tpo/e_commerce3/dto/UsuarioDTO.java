package com.uade.tpo.e_commerce3.dto;

import com.uade.tpo.e_commerce3.model.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String username;
    private String mail;
    private String nombre;
    private String apellido;
    
    // NUEVO: Agregamos el campo de rol
    private String role; 

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.mail = usuario.getMail();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        
        // NUEVO: Extraemos el rol del modelo de base de datos y se lo pasamos al DTO
        // Asegúrate de que el método getRole() exista en tu modelo Usuario (suele ser así)
        this.role = usuario.getRole().name(); 
    }
}