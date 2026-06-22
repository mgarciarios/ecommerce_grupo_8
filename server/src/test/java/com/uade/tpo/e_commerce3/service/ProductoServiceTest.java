package com.uade.tpo.e_commerce3.service;

import com.uade.tpo.e_commerce3.dto.ProductoDTO;
import com.uade.tpo.e_commerce3.dto.ProductoEliminadoDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto sampleProducto;
    private ProductoDTO sampleProductoDTO;
    private Categoria sampleCategoria;

    @BeforeEach
    void setUp() {
        sampleCategoria = new Categoria();
        sampleCategoria.setId(1L);
        sampleCategoria.setNombre("Electrónica");

        sampleProducto = new Producto();
        sampleProducto.setId(1L);
        sampleProducto.setNombre("Laptop");
        sampleProducto.setDescripcion("High-end gaming laptop");
        sampleProducto.setPrecio(1500.0);
        sampleProducto.setStock(10);
        sampleProducto.setFoto("laptop.jpg");
        sampleProducto.setCategorias(List.of(sampleCategoria));

        sampleProductoDTO = new ProductoDTO(
            1L,
            "Laptop",
            "High-end gaming laptop",
            1500.0,
            10,
            "laptop.jpg",
            new ArrayList<String>(),
            List.of("Electrónica")
        );
    }

    @Test
    void getAllProductos_ShouldReturnListOfProductoDTOs() {
        // Arrange
        when(productoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre")))
            .thenReturn(List.of(sampleProducto));

        // Act
        List<ProductoDTO> result = productoService.getAllProductos();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNombre()).isEqualTo("Laptop");
        assertThat(result.get(0).getPrecio()).isEqualTo(1500.0);
        verify(productoRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void getProductoById_WhenProductoExists_ShouldReturnProductoDTO() {
        // Arrange
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));

        // Act
        ProductoDTO result = productoService.getProductoById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Laptop");
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void getProductoById_WhenProductoDoesNotExist_ShouldThrowProductoNotFoundException() {
        // Arrange
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productoService.getProductoById(99L))
            .isInstanceOf(ProductoNotFoundException.class)
            .hasMessageContaining("Producto no encontrado con id: 99");
        
        verify(productoRepository, times(1)).findById(99L);
    }

    @Test
    void deleteProductoById_WhenProductoExists_ShouldDeleteAndReturnProductoEliminadoDTO() {
        // Arrange
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));
        doNothing().when(productoRepository).deleteById(1L);

        // Act
        ProductoEliminadoDTO result = productoService.deleteProductoById(1L);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Laptop");
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteProductoById_WhenProductoDoesNotExist_ShouldThrowProductoNotFoundException() {
        // Arrange
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productoService.deleteProductoById(99L))
            .isInstanceOf(ProductoNotFoundException.class);
        
        verify(productoRepository, times(1)).findById(99L);
        verify(productoRepository, never()).deleteById(anyLong());
    }

    @Test
    void saveProducto_WithNewCategorias_ShouldCreateProductoAndCategorias() {
        // Arrange
        ProductoDTO newProductoDTO = new ProductoDTO(
            null,
            "Mouse",
            "Wireless mouse",
            50.0,
            100,
            "mouse.jpg",
            new ArrayList<String>(),
            List.of("Periféricos", "Nueva Categoría")
        );

        Producto productoToSave = new Producto();
        productoToSave.setNombre("Mouse");
        productoToSave.setDescripcion("Wireless mouse");
        productoToSave.setPrecio(50.0);
        productoToSave.setStock(100);
        productoToSave.setFoto("mouse.jpg");

        Producto savedProducto = new Producto();
        savedProducto.setId(2L);
        savedProducto.setNombre("Mouse");
        savedProducto.setDescripcion("Wireless mouse");
        savedProducto.setPrecio(50.0);
        savedProducto.setStock(100);
        savedProducto.setFoto("mouse.jpg");
        savedProducto.setCategorias(List.of());

        // Simular que no existen las categorías
        when(categoriaRepository.findByNombreIn(List.of("Periféricos", "Nueva Categoría")))
            .thenReturn(List.of());
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria c = invocation.getArgument(0);
            c.setId(99L);
            return c;
        });
        when(productoRepository.save(any(Producto.class))).thenReturn(savedProducto);

        // Act
        ProductoDTO result = productoService.saveProducto(newProductoDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Mouse");
        verify(categoriaRepository, times(2)).save(any(Categoria.class));
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    void saveProducto_WithExistingCategorias_ShouldReuseThem() {
        // Arrange
        ProductoDTO newProductoDTO = new ProductoDTO(
            null,
            "Teclado",
            "Mechanical keyboard",
            120.0,
            30,
            "teclado.jpg",
            new ArrayList<String>(),
            List.of("Electrónica") // Categoría existente
        );

        when(categoriaRepository.findByNombreIn(List.of("Electrónica")))
            .thenReturn(List.of(sampleCategoria));
        
        Producto savedProducto = new Producto();
        savedProducto.setId(3L);
        savedProducto.setNombre("Teclado");
        savedProducto.setCategorias(List.of(sampleCategoria));
        
        when(productoRepository.save(any(Producto.class))).thenReturn(savedProducto);

        // Act
        ProductoDTO result = productoService.saveProducto(newProductoDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(categoriaRepository, never()).save(any(Categoria.class));
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    void updateProducto_WhenProductoExists_ShouldUpdateAndReturnProductoDTO() {
        // Arrange
        ProductoDTO updateDTO = new ProductoDTO(
            1L,
            "Laptop Pro",
            "Updated description",
            2000.0,
            5,
            "laptop-pro.jpg",
            new ArrayList<String>(),
            List.of("Electrónica")
        );

        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));
        when(productoRepository.save(any(Producto.class))).thenReturn(sampleProducto);

        // Act
        ProductoDTO result = productoService.updateProducto(1L, updateDTO);

        // Assert
        assertThat(result.getNombre()).isEqualTo("Laptop Pro");
        assertThat(result.getDescripcion()).isEqualTo("Updated description");
        assertThat(result.getPrecio()).isEqualTo(2000.0);
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(sampleProducto);
    }

    @Test
    void updateProducto_WhenProductoDoesNotExist_ShouldThrowProductoNotFoundException() {
        // Arrange
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productoService.updateProducto(99L, sampleProductoDTO))
            .isInstanceOf(ProductoNotFoundException.class);
        
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void updateStock_ShouldUpdateStockAndReturnProductoDTO() {
        // Arrange
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));
        when(productoRepository.save(any(Producto.class))).thenReturn(sampleProducto);

        // Act
        ProductoDTO result = productoService.updateStock(1L, 25);

        // Assert
        assertThat(result.getStock()).isEqualTo(25);
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(sampleProducto);
    }

    @Test
    void getAllCategorias_ShouldReturnListOfCategorias() {
        // Arrange
        List<Categoria> categorias = List.of(sampleCategoria);
        when(categoriaRepository.findAll()).thenReturn(categorias);

        // Act
        List<Categoria> result = productoService.getAllCategorias();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNombre()).isEqualTo("Electrónica");
        verify(categoriaRepository, times(1)).findAll();
    }
}