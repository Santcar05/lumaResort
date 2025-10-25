package com.example.lumaresort.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.http.MediaType;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.service.HabitacionService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @RequestMapping("/habitaciones")
    @GetMapping
    public ResponseEntity<List<Habitacion>> listarHabitaciones() {

        List<Habitacion> habitaciones = habitacionService.listarTodos();
        ResponseEntity<List<Habitacion>> response = ResponseEntity.ok(habitaciones);
        return response;
    }

    @GetMapping("/habitaciones/{id}")
    public ResponseEntity<Habitacion> obtenerHabitacion(@PathVariable Long id) {
        Habitacion habitacion = habitacionService.buscarHabitacionPorId(id);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(habitacion);
    }

    @PostMapping("/habitaciones")
    public ResponseEntity<Habitacion> crearHabitacion(@RequestBody Habitacion habitacion) {
        if (habitacion.getTipoHabitacion() == null || habitacion.getTipoHabitacion().getId() == null) {
            throw new RuntimeException("Debe especificar el tipo de habitación");
        }

        Habitacion habitacionCreada = habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());

        return ResponseEntity.ok(habitacionCreada);
    }

    @PutMapping("/habitaciones/{id}")
    public ResponseEntity<Habitacion> actualizarHabitacion(@PathVariable Long id, @RequestBody Habitacion habitacion) {
        if (habitacion.getTipoHabitacion() == null || habitacion.getTipoHabitacion().getId() == null) {
            throw new RuntimeException("Debe especificar el tipo de habitación");
        }
        habitacionService.actualizarHabitacion(id, habitacion, habitacion.getTipoHabitacion().getId());
        Habitacion habitacionActualizada = habitacionService.buscarHabitacionPorId(id);

        return ResponseEntity.ok(habitacionActualizada);
    }

    @DeleteMapping("/habitaciones/{id}")
    public ResponseEntity<String> eliminarHabitacion(@PathVariable Long id) {
        habitacionService.eliminarHabitacion(id);
        return new ResponseEntity<>("Habitación eliminada correctamente", HttpStatus.NO_CONTENT);
    }

}
