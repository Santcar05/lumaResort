package com.example.lumaresort.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Premio;

@Repository
public interface PremioRepository extends JpaRepository<Premio, Long> {

    List<Premio> findByUsuarioIdUsuario(Long idUsuario);

    List<Premio> findByReservaIdReserva(Long idReserva);

    List<Premio> findByUsuarioIsNull();
}
