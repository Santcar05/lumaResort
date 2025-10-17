package com.example.lumaresort.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.HabitacionRepository;
import com.example.lumaresort.repository.ServicioRepository;
import com.example.lumaresort.repository.UsuarioRepository;
import com.example.lumaresort.service.ReservaService;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private ServicioRepository servicioRepository;

    @GetMapping
    public List<Reserva> getAll() {
        return reservaService.findAll();
    }

    @GetMapping("/{id}")
    public Reserva getById(@PathVariable Long id) {
        return reservaService.findById(id);
    }

    @PostMapping
    public Reserva create(@RequestBody Reserva reserva) {
        // Obtener las referencias persistentes (evita los null en las FK)
        if (reserva.getUsuario() != null && reserva.getUsuario().getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getIdUsuario()).orElse(null);
            reserva.setUsuario(usuario);
        }

        if (reserva.getHabitacion() != null && reserva.getHabitacion().getIdHabitacion() != null) {
            Habitacion habitacion = habitacionRepository.findById(reserva.getHabitacion().getIdHabitacion()).orElse(null);
            reserva.setHabitacion(habitacion);
        }

        // Si hay servicios
        if (reserva.getServicios() != null && !reserva.getServicios().isEmpty()) {
            List<Servicio> serviciosPersistidos = new ArrayList<>();
            for (Servicio s : reserva.getServicios()) {
                servicioRepository.findById(s.getIdServicio()).ifPresent(serviciosPersistidos::add);
            }
            reserva.setServicios(serviciosPersistidos);
        }

        return reservaService.save(reserva);
    }

    @PutMapping("/{id}")
    public Reserva update(@PathVariable Long id, @RequestBody Reserva reserva) {
        reserva.setIdReserva(id);
        return reservaService.save(reserva);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Reserva reserva = reservaService.findById(id);
        if (reserva != null) {
            reservaService.delete(reserva);
        }
    }

    @GetMapping("/buscar/{id}")
    public List<Reserva> buscarReservaPorUsuarioId(@PathVariable Long id) {
        return reservaService.findByUsuarioId(id);
    }
}
