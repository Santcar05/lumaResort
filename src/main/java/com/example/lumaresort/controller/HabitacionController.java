package com.example.lumaresort.controller;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.HabitacionService;
import com.example.lumaresort.service.TipoHabitacionService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/habitaciones")
public class HabitacionController {

    @Autowired
    private Usuario usuario;

    @Autowired
    private HabitacionService habitacionService;
    
    @Autowired
    private TipoHabitacionService tipoHabitacionService;

    @GetMapping
    public String listarHabitaciones(Model model, HttpSession session) {
        // Verificar sesión de usuario admin
        /*Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuarioLogueado == null || !usuarioLogueado.isEsAdministrador()) {
            return "redirect:/login";
        }*/
            List<Habitacion> habitaciones = habitacionService.listarTodos();
            model.addAttribute("habitaciones", habitaciones);
            model.addAttribute("habitacion", new Habitacion());
            model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
            model.addAttribute("usuarioRegistrado", usuario);
            return "habitacionesAdmin";
      
    }

    @PostMapping("/crear")
    public String crearHabitacion(@ModelAttribute Habitacion habitacion, 
                                  @RequestParam(value = "imagenUrlString", required = false) String imagenUrlString,
                                  RedirectAttributes redirectAttributes) {
        try {
            // Procesar URLs de imágenes
            if (imagenUrlString != null && !imagenUrlString.trim().isEmpty()) {
                List<String> urls = Arrays.stream(imagenUrlString.split(","))
                        .map(String::trim)
                        .filter(url -> !url.isEmpty())
                        .collect(Collectors.toList());
                habitacion.setImagenUrl(urls);
            }
            
            habitacionService.crearHabitacion(habitacion, habitacion.getTipoHabitacion().getId());
            redirectAttributes.addFlashAttribute("mensaje", "Habitación creada exitosamente");
            return "redirect:/habitaciones";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la habitación: " + e.getMessage());
            return "redirect:/habitaciones";
        }
    }

    @GetMapping("/editar/{id}")
    public String editarHabitacion(@PathVariable("id") Long id, Model model, HttpSession session) {
        // Verificar sesión de usuario admin
        /*Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuarioLogueado == null || !usuarioLogueado.isEsAdministrador()) {
            return "redirect:/login";
        }*/
        
        try {
            // Buscar la habitación por ID
            Habitacion habitacion = habitacionService.buscarPorId(id);

            if (habitacion == null) {
                model.addAttribute("error", "Habitación no encontrada");
                return "redirect:/habitaciones";
            }

            // Cargar tipos de habitación para el select
            model.addAttribute("tiposHabitacion", tipoHabitacionService.listarTodos());
            model.addAttribute("habitacion", habitacion);
            model.addAttribute("usuarioRegistrado", usuario);

            // Usar la misma plantilla pero en modo edición
            return "habitacionesAdmin";

        } catch (Exception e) {
            model.addAttribute("error", "Error al cargar habitación: " + e.getMessage());
            return "redirect:/habitaciones";
        }
    }

  @PostMapping("/editar/{id}")
public String procesarEdicion(@PathVariable("id") Long id,
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
        return "redirect:/habitaciones";
    } catch (Exception e) {
        redirectAttributes.addFlashAttribute("error", "Error al actualizar: " + e.getMessage());
        return "redirect:/habitaciones/editar/" + id;
    }
}

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
