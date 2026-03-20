package com.uade.tpo.e_commerce.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce.model.Pedidos;

public interface PedidosRepository extends JpaRepository<Pedidos, Long> {
    //findAll() ya está implementado por JpaRepository, no es necesario definirlo aquí
    // select * from productos
}
