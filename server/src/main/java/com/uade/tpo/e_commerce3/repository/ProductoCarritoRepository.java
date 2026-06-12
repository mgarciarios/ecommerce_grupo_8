package com.uade.tpo.e_commerce3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.e_commerce3.model.ProductoCarrito;

public interface ProductoCarritoRepository extends JpaRepository<ProductoCarrito, Long>{

    @Modifying
    @Query("DELETE FROM ProductoCarrito pc WHERE pc.carrito.id = :carritoId")
    void emptyByCarritoId(@Param("carritoId") Long carritoId);
}
