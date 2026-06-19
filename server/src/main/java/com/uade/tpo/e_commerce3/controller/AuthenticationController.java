package com.uade.tpo.e_commerce3.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.AuthResponse;
import com.uade.tpo.e_commerce3.dto.LoginRequest;
import com.uade.tpo.e_commerce3.dto.RegisterRequest;
import com.uade.tpo.e_commerce3.dto.UsuarioDTO;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import com.uade.tpo.e_commerce3.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
//anotación de Lombok que genera automáticamente un constructor que incluye todos los campos marcados como final, es igual que usar @autowired 
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;

    private ResponseCookie buildAccessTokenCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();
    }

    private ResponseCookie buildExpiredAccessTokenCookie() {
        return ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }

    //http://localhost:8080/api/auth/register con metodo post http, enviar un body -> crear un usuario
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        //request tiene los datos del usuario a registrar, como nombre, email y contraseña
        return ResponseEntity.ok(authenticationService.register(request));
    }

    //http://localhost:8080/api/auth/login con metodo post http, enviar un body -> loguear un usuario
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authenticationService.authenticate(request);

        String token = authResponse.getToken();

        ResponseCookie cookie = buildAccessTokenCookie(token);

        authResponse.setToken(null); // Como ahora el token ya viaja por cookie, no conviene devolverlo también en el JSON. Entonces después de crear la cookie podés limpiar el token antes de responder

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString()) //Le dice al navegador: “guardá esta cookie”.
                .body(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String mail = authentication.getName();
        Usuario usuario = usuarioRepository.findByMail(mail).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        String idCarrito = carritoRepository.findByUsuarioId(usuario.getId())
                .map(Carrito::getId)
                .map(String::valueOf)
                .orElse(null);

        AuthResponse authResponse = AuthResponse.builder()
                .mensaje("Sesion activa")
                .nombreUsuario(usuario.getNombreUsuario())
                .token(null)
                .usuario(new UsuarioDTO(usuario))
                .idCarrito(idCarrito)
                .build();

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = buildExpiredAccessTokenCookie();

        return ResponseEntity
                .noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
