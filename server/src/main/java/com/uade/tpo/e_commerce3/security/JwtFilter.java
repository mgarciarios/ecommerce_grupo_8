package com.uade.tpo.e_commerce3.security;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter; // NUEVA IMPORTACIÓN

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
//este filtro se ejecuta antes de llamar al controller
//fue configurado en SecurityConfig en la instrucción `addFilterBefore`
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Este método se ejecuta en cada petición HTTP para verificar si existe un token JWT válido.
     * Dónde se utiliza:
     * - Se configura en `SecurityConfig` para que se ejecute antes que el filtro de autenticación de Spring Security.
     * - Intercepta todas las peticiones entrantes a la API.
     */
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        // NUEVO: Inicializamos el token en null. Lo buscaremos primero en las cookies y luego en el header como fallback.
        String token = null;

        // NUEVO: 1. Buscamos el token en las cookies de la petición
        // request.getCookies() devuelve un array con todas las cookies enviadas por el navegador frontend
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue(); // Extraemos el valor de la cookie que creamos en el AuthenticationController
                    break;
                }
            }
        }

        // NUEVO: 1.1 (Opcional pero recomendado en transición): Si no viene en cookie, buscamos en el header tradicional
        // Esto evita que se rompa tu frontend actual mientras haces la migración de a poco
        if (token == null) {
            // 1. Obtiene el encabezado "Authorization" de la petición.
            // en header se almacen esto ej: Bearer eyJhb...
            String header = request.getHeader("Authorization");

            // 2. Verifica si el encabezado existe y si comienza con "Bearer ".
            if (header != null && header.startsWith("Bearer ")) {
                //extrae la parte del JWT de la cabecera de autorización, eliminando el prefijo "Bearer ".
                token = header.substring(7);
            }
        }

        // 4. Valida el token usando `jwtUtil.validateToken()`. (Modificado para chequear si token no es nulo)
        if (token != null && jwtUtil.validateToken(token)) {
            // 5. Si el token es válido, extrae el nombre de usuario y los roles del token.
            String username = jwtUtil.getUsername(token);
            Set<String> roles = jwtUtil.getRoles(token);

            // transformar el conjunto de roles (cadenas de texto) en la lista de autoridades (permisos) que Spring Security necesita para verificar si el usuario tiene acceso a un recurso.
            var authorities = roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
            
            // usuario ya autenticado 
            // crea un objeto de autenticación con los detalles del usuario y sus roles
            var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
            
            // 8. Finalmente, pasa la petición al siguiente filtro en la cadena.
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        filterChain.doFilter(request, response);
    }
}