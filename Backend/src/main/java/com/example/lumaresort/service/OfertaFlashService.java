package com.example.lumaresort.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.OfertaFlash;
import com.example.lumaresort.repository.OfertaFlashRepository;

@Service
public class OfertaFlashService {

    @Autowired
    private OfertaFlashRepository ofertaFlashRepository;

    // Obtener todas las ofertas
    public List<OfertaFlash> findAll() {
        return ofertaFlashRepository.findAll();
    }

    // Guardar oferta
    public OfertaFlash save(OfertaFlash ofertaFlash) {
        return ofertaFlashRepository.save(ofertaFlash);
    }

    // Eliminar oferta
    public void delete(OfertaFlash ofertaFlash) {
        ofertaFlashRepository.delete(ofertaFlash);
    }

    // Buscar por ID
    public OfertaFlash findById(Long id) {
        return ofertaFlashRepository.findById(id).orElse(null);
    }

    // Obtener ofertas activas 
    public List<OfertaFlash> getOfertasActivas() {
        LocalDateTime now = LocalDateTime.now();
        return ofertaFlashRepository.findOfertasActivas(now);
    }

    // Obtener ofertas activas por tipo
    public List<OfertaFlash> getOfertasActivasByTipo(String tipoOferta) {
        LocalDateTime now = LocalDateTime.now();
        return ofertaFlashRepository.findByTipoOfertaAndActivaTrue(tipoOferta)
                .stream()
                .filter(oferta -> oferta.getFechaInicio().isBefore(now) && oferta.getFechaFin().isAfter(now))
                .collect(Collectors.toList());
    }

    // Desactivar ofertas expiradas 
    public void desactivarOfertasExpiradas() {
        LocalDateTime now = LocalDateTime.now();
        List<OfertaFlash> todasLasOfertas = ofertaFlashRepository.findByActivaTrue();

        for (OfertaFlash oferta : todasLasOfertas) {
            if (oferta.getFechaFin().isBefore(now)) {
                oferta.setActiva(false);
                ofertaFlashRepository.save(oferta);
            }
        }
    }

    // Activar ofertas que deben iniciar
    public void activarOfertasPendientes() {
        LocalDateTime now = LocalDateTime.now();
        List<OfertaFlash> todasLasOfertas = ofertaFlashRepository.findAll();

        for (OfertaFlash oferta : todasLasOfertas) {
            if (oferta.getFechaInicio().isBefore(now) && oferta.getFechaFin().isAfter(now) && !oferta.getActiva()) {
                oferta.setActiva(true);
                ofertaFlashRepository.save(oferta);
            }
        }
    }
}
