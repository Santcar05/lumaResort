package com.example.lumaresort.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.OfertaFlash;

@Repository
public interface OfertaFlashRepository extends JpaRepository<OfertaFlash, Long> {

    List<OfertaFlash> findByActivaTrue();

    // Buscar ofertas activas en un rango de fechas 
    @Query("SELECT o FROM OfertaFlash o WHERE o.activa = true AND o.fechaInicio <= :now AND o.fechaFin >= :now")
    List<OfertaFlash> findOfertasActivas(LocalDateTime now);

    // Buscar por tipo de oferta
    List<OfertaFlash> findByTipoOfertaAndActivaTrue(String tipoOferta);
}
