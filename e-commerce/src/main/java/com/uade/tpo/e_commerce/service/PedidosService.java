package com.uade.tpo.e_commerce.service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce.model.Pedidos;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.repository.PedidosRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import java.util.List;

@Service
@Transactional //si por algun motivo la transaccion falla, todo cambio vuelve para atras. Tipo Rollback.
public class PedidosService {
    @Autowired
    private PedidosRepository pedidosRepository;
        
    public List<Pedidos> getAllPedidos() {
        return pedidosRepository.findAll();
    }
    public Producto getPedidosByDNI(Long dni) {
        return pedidosRepository.findByDNI(dni).orElse(null);
    }
    public void deletePedidosByDNI(Long dni) {
        pedidosRepository.deleteByDNI(dni);
    }
}
