package com.uade.tpo.e_commerce3.exception;

public class UsuarioNotFoundException extends RuntimeException{
    public UsuarioNotFoundException() {
        super("El usuario no ha sido encontrado");
    }
    
}
