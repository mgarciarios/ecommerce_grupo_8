package com.uade.tpo.e_commerce3.service;

import com.uade.tpo.e_commerce3.dto.CarritoDTO;
import com.uade.tpo.e_commerce3.dto.ProductoCarritoDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.ProductoCarrito;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoCarritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarritoServiceTest {

    @Mock
    private CarritoRepository carritoRepository;

    @Mock
    private ProductoCarritoRepository productoCarritoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CarritoService carritoService;

    private Carrito sampleCarrito;
    private Producto sampleProducto;
    private ProductoCarrito sampleProductoCarrito;
    private ProductoCarritoDTO sampleProductoCarritoDTO;
    private CarritoDTO sampleCarritoDTO;

    @BeforeEach
    void setUp() {
        sampleProducto = new Producto();
        sampleProducto.setId(1L);
        sampleProducto.setNombre("Laptop");
        sampleProducto.setPrecio(1500.0);
        sampleProducto.setStock(10);

        sampleCarrito = new Carrito();
        sampleCarrito.setId(1L);
        sampleCarrito.setProductos(new ArrayList<>());

        sampleProductoCarrito = new ProductoCarrito();
        sampleProductoCarrito.setProducto(sampleProducto);
        sampleProductoCarrito.setCarrito(sampleCarrito);
        sampleProductoCarrito.setCantidad_producto(2);

        sampleProductoCarritoDTO = new ProductoCarritoDTO();
        sampleProductoCarritoDTO.setProductoId(1L);
        sampleProductoCarritoDTO.setCantidad(2);

        sampleCarritoDTO = new CarritoDTO(sampleCarrito);
    }

    @Test
    void getAllCarritos_ShouldReturnListOfCarritoDTOs() {
        // Arrange
        when(carritoRepository.findAll()).thenReturn(List.of(sampleCarrito));

        // Act
        List<CarritoDTO> result = carritoService.getAllCarritos();

        // Assert
        assertThat(result).hasSize(1);
        verify(carritoRepository, times(1)).findAll();
    }

    @Test
    void addProductoToCarrito_WhenCarritoAndProductoExist_ShouldAddProduct() {
        // Arrange
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.addProductoToCarrito(1L, sampleProductoCarritoDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(carritoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(any(Carrito.class));
    }

    @Test
    void addProductoToCarrito_WhenCarritoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(99L, sampleProductoCarritoDTO))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Carrito no encontrado con id: 99");
        
        verify(carritoRepository, times(1)).findById(99L);
        verify(productoRepository, never()).findById(anyLong());
        verify(carritoRepository, never()).save(any(Carrito.class));
    }

    @Test
    void addProductoToCarrito_WhenProductoDoesNotExist_ShouldThrowProductoNotFoundException() {
        // Arrange
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());
        
        ProductoCarritoDTO dtoWithInvalidProduct = new ProductoCarritoDTO();
        dtoWithInvalidProduct.setProductoId(99L);
        dtoWithInvalidProduct.setCantidad(1);

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, dtoWithInvalidProduct))
            .isInstanceOf(ProductoNotFoundException.class)
            .hasMessageContaining("Producto no encontrado con id: 99");
        
        verify(carritoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).findById(99L);
        verify(carritoRepository, never()).save(any(Carrito.class));
    }

    @Test
    void addProductoToCarrito_WhenCantidadIsNull_ShouldThrowIllegalArgumentException() {
        // Arrange
        ProductoCarritoDTO invalidDTO = new ProductoCarritoDTO();
        invalidDTO.setProductoId(1L);
        invalidDTO.setCantidad(null);

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, invalidDTO))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("La cantidad es obligatoria y debe ser mayor que 0");
        
        verify(carritoRepository, never()).findById(anyLong());
        verify(productoRepository, never()).findById(anyLong());
    }

    //TODO: ERROR

    @Test
    void addProductoToCarrito_WhenCantidadIsZero_ShouldThrowIllegalArgumentException() {
        // Arrange
        ProductoCarritoDTO invalidDTO = new ProductoCarritoDTO();
        invalidDTO.setProductoId(1L);
        invalidDTO.setCantidad(0);

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, invalidDTO))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("La cantidad es obligatoria y debe ser mayor que 0");
    }

    //TODO: ERROR

    @Test
    void addProductoToCarrito_WhenCantidadIsNegative_ShouldThrowIllegalArgumentException() {
        // Arrange
        ProductoCarritoDTO invalidDTO = new ProductoCarritoDTO();
        invalidDTO.setProductoId(1L);
        invalidDTO.setCantidad(-5);

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, invalidDTO))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("La cantidad es obligatoria y debe ser mayor que 0");
    }

    @Test
    void addProductoToCarrito_WhenStockIsInsufficient_ShouldThrowRuntimeException() {
        // Arrange
        sampleProducto.setStock(1);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));

        ProductoCarritoDTO dtoWithHighQuantity = new ProductoCarritoDTO();
        dtoWithHighQuantity.setProductoId(1L);
        dtoWithHighQuantity.setCantidad(5);

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, dtoWithHighQuantity))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Stock insuficiente");
        
        verify(carritoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).findById(1L);
        verify(carritoRepository, never()).save(any(Carrito.class));
    }

    @Test
    void addProductoToCarrito_WhenProductAlreadyInCarrito_ShouldIncreaseQuantity() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        
        ProductoCarritoDTO additionalDTO = new ProductoCarritoDTO();
        additionalDTO.setProductoId(1L);
        additionalDTO.setCantidad(3);
        
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.addProductoToCarrito(1L, additionalDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(carritoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(any(Carrito.class));
    }

    @Test
    void addProductoToCarrito_WhenTotalQuantityExceedsStock_ShouldThrowRuntimeException() {
        // Arrange
        sampleProductoCarrito.setCantidad_producto(8); // Already has 8
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        sampleProducto.setStock(10); // Stock is 10, trying to add 3 would make 11
        
        ProductoCarritoDTO additionalDTO = new ProductoCarritoDTO();
        additionalDTO.setProductoId(1L);
        additionalDTO.setCantidad(3);
        
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(sampleProducto));

        // Act & Assert
        assertThatThrownBy(() -> carritoService.addProductoToCarrito(1L, additionalDTO))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("No hay suficiente stock");
        
        verify(carritoRepository, never()).save(any(Carrito.class));
    }

    @Test
    void deleteProductoInCarritoById_WhenCarritoExists_ShouldRemoveProduct() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.deleteProductoInCarritoById(1L, 1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(sampleCarrito.getProductos()).isEmpty();
        verify(carritoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void deleteProductoInCarritoById_WhenCarritoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> carritoService.deleteProductoInCarritoById(99L, 1L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Carrito no encontrado con id: 99");
        
        verify(carritoRepository, never()).save(any(Carrito.class));
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenReducingPartialQuantity_ShouldDecreaseQuantity() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.reduceCantidadProductoInCarritoById(1L, 1L, 1);

        // Assert
        assertThat(result).isNotNull();
        assertThat(sampleProductoCarrito.getCantidad_producto()).isEqualTo(1); // Was 2, reduced by 1
        verify(carritoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenReducingFullQuantity_ShouldRemoveItem() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.reduceCantidadProductoInCarritoById(1L, 1L, 2);

        // Assert
        assertThat(result).isNotNull();
        assertThat(sampleCarrito.getProductos()).isEmpty();
        verify(carritoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenCarritoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> carritoService.reduceCantidadProductoInCarritoById(99L, 1L, 1))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Carrito no encontrado con id: 99");
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenProductNotInCarrito_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));

        // Act & Assert
        assertThatThrownBy(() -> carritoService.reduceCantidadProductoInCarritoById(1L, 99L, 1))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Producto no encontrado en el carrito");
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenQuantityToRemoveExceedsExisting_ShouldThrowRuntimeException() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));

        // Act & Assert
        assertThatThrownBy(() -> carritoService.reduceCantidadProductoInCarritoById(1L, 1L, 10))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("No puedes eliminar 10 productos. El carrito solo tiene 2");
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenQuantityToRemoveIsZero_ShouldThrowRuntimeException() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));

        // Act & Assert
        assertThatThrownBy(() -> carritoService.reduceCantidadProductoInCarritoById(1L, 1L, 0))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("La cantidad a eliminar debe ser mayor a 0");
    }

    @Test
    void reduceCantidadProductoInCarritoById_WhenQuantityToRemoveIsNegative_ShouldThrowRuntimeException() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));

        // Act & Assert
        assertThatThrownBy(() -> carritoService.reduceCantidadProductoInCarritoById(1L, 1L, -3))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("La cantidad a eliminar debe ser mayor a 0");
    }

    @Test
    void getCarritoById_WhenCarritoExists_ShouldReturnCarritoDTO() {
        // Arrange
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));

        // Act
        CarritoDTO result = carritoService.getCarritoById(1L);

        // Assert
        assertThat(result).isNotNull();
        verify(carritoRepository, times(1)).findById(1L);
    }

    @Test
    void getCarritoById_WhenCarritoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> carritoService.getCarritoById(99L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Carrito no encontrado con id: 99");
    }

    @Test
    void saveCarrito_ShouldReturnSavedCarrito() {
        // Arrange
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        Carrito result = carritoService.saveCarrito(sampleCarrito);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void deleteCarritoById_ShouldCallRepositoryDeleteById() {
        // Arrange
        doNothing().when(carritoRepository).deleteById(1L);

        // Act
        carritoService.deleteCarritoById(1L);

        // Assert
        verify(carritoRepository, times(1)).deleteById(1L);
    }

    @Test
    void vaciarCarritoById_WhenCarritoExists_ShouldClearAllProducts() {
        // Arrange
        sampleCarrito.getProductos().add(sampleProductoCarrito);
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.vaciarCarritoById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(sampleCarrito.getProductos()).isEmpty();
        verify(carritoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void vaciarCarritoById_WhenCarritoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        when(carritoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> carritoService.vaciarCarritoById(99L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Carrito no encontrado con id: 99");
    }

    @Test
    void vaciarCarritoById_WhenCarritoIsAlreadyEmpty_ShouldStillWork() {
        // Arrange
        when(carritoRepository.findById(1L)).thenReturn(Optional.of(sampleCarrito));
        when(carritoRepository.save(any(Carrito.class))).thenReturn(sampleCarrito);

        // Act
        CarritoDTO result = carritoService.vaciarCarritoById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(sampleCarrito.getProductos()).isEmpty();
        verify(carritoRepository, times(1)).findById(1L);
        verify(carritoRepository, times(1)).save(sampleCarrito);
    }

    @Test
    void doCheckout_ShouldReturnNull_WhenNotImplemented() {
        // Act
        Carrito result = carritoService.doCheckout(1L);

        // Assert
        assertThat(result).isNull();
    }
}