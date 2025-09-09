package com.example.lumaresort.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.TipoHabitacion;
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

    // Listar habitaciones
    @GetMapping
    public String listarHabitaciones(Model model) {
        List<Habitacion> habitaciones = habitacionService.listarTodos();
        List<TipoHabitacion> tipos = tipoHabitacionService.listarTodos();

        model.addAttribute("habitaciones", habitaciones);
        model.addAttribute("habitacion", new Habitacion());
        model.addAttribute("tiposHabitacion", tipos);
        model.addAttribute("usuarioRegistrado", usuario);
        model.addAttribute("activePage", "habitaciones");

        return "habitacionesAdmin";
    }

    // Endpoint JSON para el modal de edición
    @GetMapping("/{id}/json")
    @ResponseBody
    public Habitacion obtenerHabitacionJson(@PathVariable Long id) {
        return habitacionService.buscarPorId(id);
    }

    // Crear habitación
    @PostMapping("/crear")
    public String crearHabitacion(@ModelAttribute Habitacion habitacion,
                                  RedirectAttributes redirectAttributes) {
        try {
            habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());
            redirectAttributes.addFlashAttribute("mensaje", "Habitación creada exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la habitación: " + e.getMessage());
        }
        return "redirect:/habitaciones";
    }

    // Editar habitación
    @PostMapping("/editar/{id}")
    public String editarHabitacion(@PathVariable Long id,
                                   @ModelAttribute Habitacion habitacion,
                                   RedirectAttributes redirectAttributes) {
        try {
            habitacionService.actualizarHabitacion(id, habitacion, habitacion.getTipoHabitacion().getId());
            redirectAttributes.addFlashAttribute("mensaje", "Habitación actualizada exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar la habitación: " + e.getMessage());
        }
        return "redirect:/habitaciones";
    }

    // Eliminar habitación
    @GetMapping("/eliminar/{id}")
    public String eliminarHabitacion(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            habitacionService.eliminarHabitacion(id);
            redirectAttributes.addFlashAttribute("mensaje", "Habitación eliminada exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar habitación: " + e.getMessage());
        }
        return "redirect:/habitaciones";
    }
}
