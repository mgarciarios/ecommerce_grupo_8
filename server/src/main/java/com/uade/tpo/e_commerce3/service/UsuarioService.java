package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.dto.UsuarioDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;


//Favoritos del usuario
@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> getAllUsuarios() {
    return usuarioRepository.findAll().stream()
            .map(UsuarioDTO::new)
            .collect(Collectors.toList());
}

    public UsuarioDTO getUsuarioById(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new UsuarioNotFoundException(id));
    return new UsuarioDTO(usuario);
}

    public Usuario getUsuarioByMail(String mail){
        return usuarioRepository.findByMail(mail).orElse(null);
    }

    public void deleteUsuarioById(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public UsuarioDTO updateUsuario(Long id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new UsuarioNotFoundException(id));
    
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setMail(dto.getMail());
        
        Usuario guardado = usuarioRepository.save(usuario);
        return new UsuarioDTO(guardado);
    }

    // ... tus otras importaciones e inyecciones (UsuarioRepository, etc.)
    @Autowired
    private ProductoRepository productoRepository;

    // Método para mapear un Producto a ProductoDTO (usa la lógica/mapeador que ya tengas en tu proyecto)
    private ProductoDTO convertToProductoDTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setFoto(producto.getFoto());
        return dto;
    }

    // 1. Listar Favoritos
    public List<ProductoDTO> getFavoritosByUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNotFoundException(usuarioId));
        
        return usuario.getFavoritos().stream()
                .map(this::convertToProductoDTO)
                .toList();
    }

    // 2. Agregar a Favoritos
    @Transactional
    public void agregarProductoAFavoritos(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNotFoundException(usuarioId));
                
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        // Evita duplicados en la lista antes de guardar
        if (!usuario.getFavoritos().contains(producto)) {
            usuario.getFavoritos().add(producto);
            usuarioRepository.save(usuario);
        }
    }

    // 3. Eliminar de Favoritos
    @Transactional
    public void eliminarProductoDeFavoritos(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNotFoundException(usuarioId));
                
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        if (usuario.getFavoritos().contains(producto)) {
            usuario.getFavoritos().remove(producto);
            usuarioRepository.save(usuario);
        }
    }
}
