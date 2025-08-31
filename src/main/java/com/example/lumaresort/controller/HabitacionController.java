package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.HabitacionService;
import com.example.lumaresort.service.TipoHabitacionService;

@Controller
@RequestMapping("/habitaciones")
public class HabitacionController {

    @Autowired
    private Usuario usuario;
    @Autowired
    private HabitacionService habitacionService;
    @Autowired
    private TipoHabitacionService tipoHabitacionService;
    //@Autowired
    //private Cliente clienteNuevo;

    @GetMapping
    public String habitaciones(Model model) {

        model.addAttribute("habitaciones", habitacionService.listarTodos());
        model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
        model.addAttribute("habitacion", new Habitacion());
        model.addAttribute("usuarioRegistrado", usuario);
        return "habitacionesAdmin";

    }

    @PostMapping("/crear")
    public String mostrarFormularioCrear(Model model, @ModelAttribute Habitacion habitacion) {
        model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
        if (habitacion.getIdHabitacion() != null) {
            habitacionService.actualizarHabitacion(habitacion.getIdHabitacion(), habitacion, habitacion.getTipoHabitacion().getId());
            model.addAttribute("habitaciones", habitacionService.listarTodos());
            return "redirect:/habitaciones";
        } else {
            habitacionService.crearHabitacion(habitacion);
        }

        model.addAttribute("habitaciones", habitacionService.listarTodos());
        model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
        model.addAttribute("usuarioRegistrado", usuario);
        model.addAttribute("nuevoCliente", new Cliente());

        return "habitacionesAdmin";
    }

    @GetMapping("/eliminar/{id}")
    public String borrar(@PathVariable Long id) {
        habitacionService.eliminarHabitacion(id);
        return "redirect:/habitaciones";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {

        Habitacion habitacion = habitacionService.buscarHabitacionPorId(id);
        model.addAttribute("habitacion", habitacion);
        model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
        model.addAttribute("usuarioRegistrado", usuario);
        return "habitacionesAdmin";
    }

    @PostMapping("/actualizar")
    public String actualizar(@ModelAttribute Habitacion habitacion) {
        habitacionService.actualizarHabitacion(habitacion.getIdHabitacion(), habitacion, habitacion.getTipoHabitacion().getId());
        return "redirect:/habitaciones";
    }

}
