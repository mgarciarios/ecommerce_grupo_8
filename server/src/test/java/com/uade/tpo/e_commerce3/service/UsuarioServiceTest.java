package com.uade.tpo.e_commerce3.service;

import com.uade.tpo.e_commerce3.dto.UsuarioDTO;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario sampleUsuario;
    private UsuarioDTO sampleUsuarioDTO;

    @BeforeEach
    void setUp() {
        sampleUsuario = new Usuario();
        sampleUsuario.setId(1L);
        sampleUsuario.setNombre("Juan");
        sampleUsuario.setApellido("Pérez");
        sampleUsuario.setMail("juan.perez@example.com");

        sampleUsuarioDTO = new UsuarioDTO(sampleUsuario);
    }

    @Test
    void getAllUsuarios_ShouldReturnListOfUsuarioDTOs() {
        // Arrange
        when(usuarioRepository.findAll()).thenReturn(List.of(sampleUsuario));

        // Act
        List<UsuarioDTO> result = usuarioService.getAllUsuarios();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getNombre()).isEqualTo("Juan");
        assertThat(result.get(0).getApellido()).isEqualTo("Pérez");
        assertThat(result.get(0).getMail()).isEqualTo("juan.perez@example.com");
        
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void getAllUsuarios_WhenNoUsuariosExist_ShouldReturnEmptyList() {
        // Arrange
        when(usuarioRepository.findAll()).thenReturn(List.of());

        // Act
        List<UsuarioDTO> result = usuarioService.getAllUsuarios();

        // Assert
        assertThat(result).isEmpty();
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void getUsuarioById_WhenUsuarioExists_ShouldReturnUsuarioDTO() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(sampleUsuario));

        // Act
        UsuarioDTO result = usuarioService.getUsuarioById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Juan");
        assertThat(result.getMail()).isEqualTo("juan.perez@example.com");
        
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void getUsuarioById_WhenUsuarioDoesNotExist_ShouldThrowUsuarioNotFoundException() {
        // Arrange
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.getUsuarioById(99L))
            .isInstanceOf(UsuarioNotFoundException.class)
            .hasMessageContaining("99"); // Assuming the exception constructor passes the id
            
        verify(usuarioRepository, times(1)).findById(99L);
    }

    @Test
    void getUsuarioByMail_WhenUsuarioExists_ShouldReturnUsuario() {
        // Arrange
        when(usuarioRepository.findByMail("juan.perez@example.com")).thenReturn(Optional.of(sampleUsuario));

        // Act
        Usuario result = usuarioService.getUsuarioByMail("juan.perez@example.com");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getMail()).isEqualTo("juan.perez@example.com");
        
        verify(usuarioRepository, times(1)).findByMail("juan.perez@example.com");
    }

    @Test
    void getUsuarioByMail_WhenUsuarioDoesNotExist_ShouldReturnNull() {
        // Arrange
        when(usuarioRepository.findByMail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act
        Usuario result = usuarioService.getUsuarioByMail("nonexistent@example.com");

        // Assert
        assertThat(result).isNull();
        verify(usuarioRepository, times(1)).findByMail("nonexistent@example.com");
    }

    @Test
    void deleteUsuarioById_ShouldCallRepositoryDeleteById() {
        // Arrange
        doNothing().when(usuarioRepository).deleteById(1L);

        // Act
        usuarioService.deleteUsuarioById(1L);

        // Assert
        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteUsuarioById_WhenIdDoesNotExist_ShouldStillCallDeleteById() {
        // Arrange - Repository doesn't throw exception for deleteById even if id doesn't exist
        doNothing().when(usuarioRepository).deleteById(99L);

        // Act
        usuarioService.deleteUsuarioById(99L);

        // Assert
        verify(usuarioRepository, times(1)).deleteById(99L);
    }

    @Test
    void saveUsuario_ShouldReturnSavedUsuario() {
        // Arrange
        Usuario newUsuario = new Usuario();
        newUsuario.setNombre("María");
        newUsuario.setApellido("González");
        newUsuario.setMail("maria.gonzalez@example.com");

        Usuario savedUsuario = new Usuario();
        savedUsuario.setId(2L);
        savedUsuario.setNombre("María");
        savedUsuario.setApellido("González");
        savedUsuario.setMail("maria.gonzalez@example.com");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUsuario);

        // Act
        Usuario result = usuarioService.saveUsuario(newUsuario);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getNombre()).isEqualTo("María");
        assertThat(result.getApellido()).isEqualTo("González");
        assertThat(result.getMail()).isEqualTo("maria.gonzalez@example.com");
        
        verify(usuarioRepository, times(1)).save(newUsuario);
    }

    @Test
    void updateUsuario_WhenUsuarioExists_ShouldUpdateAndReturnUsuarioDTO() {
        // Arrange
        UsuarioDTO updateDTO = new UsuarioDTO();
        updateDTO.setNombre("Juan Carlos");
        updateDTO.setApellido("Pérez Rodríguez");
        updateDTO.setMail("juancarlos.perez@example.com");

        Usuario updatedUsuario = new Usuario();
        updatedUsuario.setId(1L);
        updatedUsuario.setNombre("Juan Carlos");
        updatedUsuario.setApellido("Pérez Rodríguez");
        updatedUsuario.setMail("juancarlos.perez@example.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(sampleUsuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(updatedUsuario);

        // Act
        UsuarioDTO result = usuarioService.updateUsuario(1L, updateDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Juan Carlos");
        assertThat(result.getApellido()).isEqualTo("Pérez Rodríguez");
        assertThat(result.getMail()).isEqualTo("juancarlos.perez@example.com");
        
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void updateUsuario_WhenUsuarioDoesNotExist_ShouldThrowUsuarioNotFoundException() {
        // Arrange
        UsuarioDTO updateDTO = new UsuarioDTO();
        updateDTO.setNombre("Test");
        updateDTO.setApellido("User");
        updateDTO.setMail("test@example.com");

        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.updateUsuario(99L, updateDTO))
            .isInstanceOf(UsuarioNotFoundException.class);
        
        verify(usuarioRepository, times(1)).findById(99L);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void updateUsuario_ShouldOnlyUpdateNombreApellidoAndMail() {
        // Arrange - Verify that only specific fields are updated
        UsuarioDTO updateDTO = new UsuarioDTO();
        updateDTO.setNombre("Nombre Actualizado");
        updateDTO.setApellido("Apellido Actualizado");
        updateDTO.setMail("mail.actualizado@example.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(sampleUsuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UsuarioDTO result = usuarioService.updateUsuario(1L, updateDTO);

        // Assert
        assertThat(result.getNombre()).isEqualTo("Nombre Actualizado");
        assertThat(result.getApellido()).isEqualTo("Apellido Actualizado");
        assertThat(result.getMail()).isEqualTo("mail.actualizado@example.com");
        
        // The ID should remain the same
        assertThat(result.getId()).isEqualTo(1L);
    }
}