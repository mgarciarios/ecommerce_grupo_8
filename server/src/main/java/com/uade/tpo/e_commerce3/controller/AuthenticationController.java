package com.uade.tpo.e_commerce3.controller;

import org.springframework.http.ResponseEntity; // NUEVA IMPORTACIÓN
import org.springframework.web.bind.annotation.PostMapping; // NUEVA IMPORTACIÓN
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.AuthResponse;
import com.uade.tpo.e_commerce3.dto.ChangePasswordRequest;
import com.uade.tpo.e_commerce3.dto.LoginRequest;
import com.uade.tpo.e_commerce3.dto.RegisterRequest;
import com.uade.tpo.e_commerce3.security.JwtUtil;
import com.uade.tpo.e_commerce3.service.AuthenticationService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
//anotación de Lombok que genera automáticamente un constructor que incluye todos los campos marcados como final, es igual que usar @autowired 
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;

    //http://localhost:8080/api/auth/register con metodo post http, enviar un body -> crear un usuario
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        //request tiene los datos del usuario a registrar, como nombre, email y contraseña
        AuthResponse authResponse = authenticationService.register(request);
        
        // NUEVO: Delegamos la creación de la cookie a un método auxiliar para no repetir código
        createJwtCookie(response, authResponse.getToken()); 
        
        return ResponseEntity.ok(authResponse);
    }

    //http://localhost:8080/api/auth/login con metodo post http, enviar un body -> loguear un usuario
    @PostMapping("/login")
    // NUEVO: Agregamos HttpServletResponse como parámetro para poder inyectar la cookie en la respuesta HTTP
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authenticationService.authenticate(request);
        
        // NUEVO: Llamamos al método que crea y adjunta la cookie
        createJwtCookie(response, authResponse.getToken());
        
        return ResponseEntity.ok(authResponse);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                  HttpServletRequest httpRequest) {
        String token = extractJwt(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token no válido o sesión expirada");
        }
        String mail = jwtUtil.getUsername(token);
        authenticationService.changePassword(request, mail);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

    private String extractJwt(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    // NUEVO METODO: Crea la cookie HttpOnly y la adjunta a la respuesta
    private void createJwtCookie(HttpServletResponse response, String token) {
        // Creamos una nueva cookie llamada "jwt" que contiene el token generado
        Cookie jwtCookie = new Cookie("jwt", token);
        
        // FUNDAMENTAL: Evita que la cookie sea accesible mediante JavaScript en el frontend (protección XSS)
        jwtCookie.setHttpOnly(true); 
        
        // Define que la cookie será enviada al backend en cualquier ruta de la aplicación ("/")
        jwtCookie.setPath("/"); 
        
        // Tiempo de vida de la cookie en segundos (Ej: 24 horas). 
        // IMPORTANTE: Esto debería coincidir con el tiempo de expiración que le configures al JWT en tu JwtUtil.
        jwtCookie.setMaxAge(24 * 60 * 60); 
        
        // jwtCookie.setSecure(true); // NOTA: Descomentar esto en producción si usas HTTPS. En localhost (HTTP) debe estar en false o comentada.

        // Adjuntamos la cookie a la respuesta HTTP que se enviará al frontend
        response.addCookie(jwtCookie);
    }
}