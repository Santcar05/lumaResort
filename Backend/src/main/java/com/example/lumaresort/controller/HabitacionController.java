package com.example.lumaresort.controller;

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
import com.example.lumaresort.service.HabitacionService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @RequestMapping("/habitaciones")
    @GetMapping
    public List<Habitacion> listarHabitaciones() {
        return habitacionService.listarTodos();
    }

    @GetMapping("/habitaciones/{id}")
    public Habitacion obtenerHabitacion(@PathVariable Long id) {
        return habitacionService.buscarHabitacionPorId(id);
    }

    @PostMapping("/habitaciones")
    public Habitacion crearHabitacion(@RequestBody Habitacion habitacion) {
        if (habitacion.getTipoHabitacion() == null || habitacion.getTipoHabitacion().getId() == null) {
            throw new RuntimeException("Debe especificar el tipo de habitación");
        }
        return habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());
    }

    @PutMapping("/habitaciones/{id}")
    public Habitacion actualizarHabitacion(@PathVariable Long id, @RequestBody Habitacion habitacion) {
        if (habitacion.getTipoHabitacion() == null || habitacion.getTipoHabitacion().getId() == null) {
            throw new RuntimeException("Debe especificar el tipo de habitación");
        }
        habitacionService.actualizarHabitacion(id, habitacion, habitacion.getTipoHabitacion().getId());
        return habitacionService.buscarHabitacionPorId(id);
    }

    @DeleteMapping("/habitaciones/{id}")
    public void eliminarHabitacion(@PathVariable Long id) {
        habitacionService.eliminarHabitacion(id);
    }

}
