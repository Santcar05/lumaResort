package com.example.lumaresort.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lumaresort.entities.Premio;
import com.example.lumaresort.service.PremioService;

@RestController
@RequestMapping("/premios")
@CrossOrigin(origins = "http://localhost:4200")
public class PremioController {

    @Autowired
    private PremioService premioService;

    // Obtener todos los premios
    @GetMapping
    public List<Premio> getAll() {
        return premioService.findAll();
    }

    // Obtener premios disponibles
    @GetMapping("/disponibles")
    public List<Premio> getPremiosDisponibles() {
        return premioService.getPremiosDisponibles();
    }

    // Obtener premio por ID
    @GetMapping("/{id}")
    public Premio getById(@PathVariable Long id) {
        return premioService.findById(id);
    }

    // Obtener premios ganados por un usuario
    @GetMapping("/usuario/{id}")
    public List<Premio> getPremiosByUsuario(@PathVariable Long id) {
        return premioService.getPremiosByUsuario(id);
    }

    // Obtener premios de una reserva
    @GetMapping("/reserva/{id}")
    public List<Premio> getPremiosByReserva(@PathVariable Long id) {
        return premioService.getPremiosByReserva(id);
    }

    // Asignar premio a usuario y reserva
    @PostMapping("/asignar")
    public ResponseEntity<Premio> asignarPremio(@RequestBody Map<String, Long> payload) {
        Long premioId = payload.get("premioId");
        Long usuarioId = payload.get("usuarioId");
        Long reservaId = payload.get("reservaId");

        if (premioId == null || usuarioId == null || reservaId == null) {
            return ResponseEntity.badRequest().build();
        }

        Premio premioAsignado = premioService.asignarPremio(premioId, usuarioId, reservaId);

        if (premioAsignado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(premioAsignado);
    }

    // Crear premio 
    @PostMapping
    public Premio create(@RequestBody Premio premio) {
        return premioService.save(premio);
    }

    // Eliminar premio
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Premio premio = premioService.findById(id);
        if (premio != null) {
            premioService.delete(premio);
        }
    }
}
