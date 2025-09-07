package com.example.lumaresort.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

        return "habitacionesAdmin"; // tu plantilla Thymeleaf
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
                                  @RequestParam(value = "imagenUrlString", required = false) String imagenUrlString,
                                  RedirectAttributes redirectAttributes) {
        try {
            if (imagenUrlString != null && !imagenUrlString.trim().isEmpty()) {
                List<String> urls = Arrays.stream(imagenUrlString.split(","))
                        .map(String::trim)
                        .filter(url -> !url.isEmpty())
                        .collect(Collectors.toList());
                habitacion.setImagenUrl(urls);
            }
            habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());
            redirectAttributes.addFlashAttribute("mensaje", "Habitación creada exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la habitación: " + e.getMessage());
        }
        return "redirect:/habitaciones";
    }

    @PostMapping("/editar/{id}")
public String editarHabitacion(@PathVariable Long id,
                               @ModelAttribute Habitacion habitacion,
                               @RequestParam(value = "imagenUrlString", required = false) String imagenUrlString,
                               RedirectAttributes redirectAttributes) {
    try {
        if (imagenUrlString != null && !imagenUrlString.trim().isEmpty()) {
            List<String> urls = Arrays.stream(imagenUrlString.split(","))
                                      .map(String::trim)
                                      .filter(url -> !url.isEmpty())
                                      .collect(Collectors.toList());
            habitacion.setImagenUrl(urls);
        }
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
