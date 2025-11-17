package com.example.lumaresort.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lumaresort.entities.OfertaFlash;
import com.example.lumaresort.service.OfertaFlashService;

@RestController
@RequestMapping("/ofertas-flash")
@CrossOrigin(origins = "http://localhost:4200")
public class OfertaFlashController {

    @Autowired
    private OfertaFlashService ofertaFlashService;

    // Obtener todas las ofertas
    @GetMapping
    public List<OfertaFlash> getAll() {
        return ofertaFlashService.findAll();
    }

    // Obtener ofertas activas 
    @GetMapping("/activas")
    public List<OfertaFlash> getOfertasActivas() {
        return ofertaFlashService.getOfertasActivas();
    }

    // Obtener oferta por ID
    @GetMapping("/{id}")
    public ResponseEntity<OfertaFlash> getById(@PathVariable Long id) {
        OfertaFlash oferta = ofertaFlashService.findById(id);
        if (oferta == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(oferta);
    }

    // Obtener ofertas activas por tipo
    @GetMapping("/tipo/{tipoOferta}")
    public List<OfertaFlash> getOfertasByTipo(@PathVariable String tipoOferta) {
        return ofertaFlashService.getOfertasActivasByTipo(tipoOferta);
    }

    // Crear nueva oferta
    @PostMapping
    public ResponseEntity<OfertaFlash> create(@RequestBody OfertaFlash ofertaFlash) {
        OfertaFlash nuevaOferta = ofertaFlashService.save(ofertaFlash);
        return ResponseEntity.ok(nuevaOferta);
    }

    // Actualizar oferta
    @PutMapping("/{id}")
    public ResponseEntity<OfertaFlash> update(@PathVariable Long id, @RequestBody OfertaFlash ofertaFlash) {
        OfertaFlash ofertaExistente = ofertaFlashService.findById(id);
        if (ofertaExistente == null) {
            return ResponseEntity.notFound().build();
        }

        ofertaFlash.setId(id);
        OfertaFlash ofertaActualizada = ofertaFlashService.save(ofertaFlash);
        return ResponseEntity.ok(ofertaActualizada);
    }

    // Eliminar oferta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        OfertaFlash oferta = ofertaFlashService.findById(id);
        if (oferta == null) {
            return ResponseEntity.notFound().build();
        }

        ofertaFlashService.delete(oferta);
        return ResponseEntity.noContent().build();
    }

    //desactivar ofertas expiradas
    @PostMapping("/desactivar-expiradas")
    public ResponseEntity<String> desactivarExpiradas() {
        ofertaFlashService.desactivarOfertasExpiradas();
        return ResponseEntity.ok("Ofertas expiradas desactivadas correctamente");
    }

    //activar ofertas pendientes
    @PostMapping("/activar-pendientes")
    public ResponseEntity<String> activarPendientes() {
        ofertaFlashService.activarOfertasPendientes();
        return ResponseEntity.ok("Ofertas pendientes activadas correctamente");
    }
}
