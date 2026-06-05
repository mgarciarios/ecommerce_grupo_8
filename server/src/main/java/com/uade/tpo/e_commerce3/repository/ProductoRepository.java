package com.uade.tpo.e_commerce3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.e_commerce3.model.Producto;


public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query(value = "SELECT * FROM productos WHERE nombre REGEXP :pattern", nativeQuery = true)
    List<Producto> findByNombreRegex(@Param("pattern") String pattern);
}
