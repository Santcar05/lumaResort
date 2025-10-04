package com.example.lumaresort.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.service.HabitacionService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
//No utilizar RequestMapping 
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/habitaciones")
    public List<Habitacion> habitaciones(Model model) {

        return habitacionService.listarTodos();
    }

    @PostMapping("/habitaciones")
    public Habitacion guardarHabitacion(@RequestBody Habitacion habitacion) {
        System.out.println("Habitacion recibida: " + habitacion);

        if (habitacion.getTipoHabitacion() == null || habitacion.getTipoHabitacion().getId() == null) {
            throw new RuntimeException("Debe especificar el tipo de habitación");
        }

        return habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());
    }

    //Eliminar habitacion
    @DeleteMapping("/habitaciones/{id}")
    public void eliminarHabitacion(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        habitacionService.eliminarHabitacion(id);
    }

    @GetMapping("/habitaciones/{id}")
    public Habitacion obtenerHabitacionPorId(@PathVariable Long id) {
        return habitacionService.buscarHabitacionPorId(id);
    }

}
