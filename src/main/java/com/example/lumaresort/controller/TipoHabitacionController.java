package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.HabitacionService;
import com.example.lumaresort.service.TipoHabitacionService;

@Controller
@RequestMapping("/tipos")
public class TipoHabitacionController {

    @Autowired
    private Usuario usuario;

    @Autowired
    private TipoHabitacionService service;

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping
    public String listarTodos(Model model) {
        model.addAttribute("tipos", service.listarTodos());
        model.addAttribute("tipoNuevo", new TipoHabitacion());
        model.addAttribute("usuarioRegistrado", usuario);
        model.addAttribute("activePage", "tipos");
        return "lista";
    }

    @PostMapping("/crear")
    public String crear(@ModelAttribute TipoHabitacion tipo, RedirectAttributes redirectAttributes) {
        service.crear(tipo);
        redirectAttributes.addFlashAttribute("successMessage", "✅ Tipo de habitación agregado correctamente.");
        return "redirect:/tipos";
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormEditar(@PathVariable Long id, Model model) {
        model.addAttribute("tipo", service.buscarPorId(id).orElseThrow());
        return "editar";
    }

    @PostMapping("/actualizar/{id}")
    public String actualizar(@PathVariable Long id, @ModelAttribute TipoHabitacion tipo, RedirectAttributes redirectAttributes) {
        service.actualizar(id, tipo);
        redirectAttributes.addFlashAttribute("successMessage", "✅ Tipo de habitación editado correctamente.");
        return "redirect:/tipos";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        try {
            service.eliminar(id);
            redirectAttributes.addFlashAttribute("successMessage", "✅ El tipo de habitación se eliminó correctamente.");
            return "redirect:/tipos";
        } catch (IllegalStateException e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("tipos", service.listarTodos());
            model.addAttribute("tipoNuevo", new TipoHabitacion());
            model.addAttribute("usuarioRegistrado", usuario);
            model.addAttribute("activePage", "tipos");
            return "lista"; 
        }
    }

    @GetMapping("/ver/{id}")
    public String verDetalle(@PathVariable Long id, Model model) {
        TipoHabitacion tipoHabitacion = service.buscarPorId(id).orElseThrow();
        model.addAttribute("tipoHabitacion", tipoHabitacion); // 🔹 corregido el nombre
        model.addAttribute("habitaciones", tipoHabitacion.getHabitaciones());
        return "detalle";
    }

    @GetMapping("/habitaciones/{id}/json")
    @ResponseBody
    public Habitacion getHabitacionJson(@PathVariable Long id) {
        return habitacionService.buscarHabitacionPorId(id);
    }

    @GetMapping("/{tipoId}/editarHabitacion/{habitacionId}")
    public String mostrarFormularioEditarHabitacion(@PathVariable Long tipoId,
                                                    @PathVariable Long habitacionId,
                                                    Model model) {
        Habitacion habitacion = habitacionService.buscarHabitacionPorId(habitacionId);
        model.addAttribute("habitacion", habitacion);
        model.addAttribute("tipoHabitacionId", tipoId);
        model.addAttribute("modoEdicion", true);
        return "crearHab"; 
    }

    @PostMapping("/{tipoId}/editarHabitacion/{habitacionId}/actualizar")
    public String actualizarHabitacion(@ModelAttribute("habitacion") Habitacion habitacion,
                                       @PathVariable Long tipoId,
                                       @PathVariable Long habitacionId,
                                       RedirectAttributes redirectAttributes) {
        habitacionService.actualizarHabitacion(habitacionId, habitacion, tipoId);
        redirectAttributes.addFlashAttribute("successMessage", "✅ Habitación actualizada correctamente.");
        return "redirect:/tipos/ver/" + tipoId;
    }

    @GetMapping("/habitaciones/ver/{id}/borrar")
    public String borrarHabitacion(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        habitacionService.eliminarHabitacion(id);
        redirectAttributes.addFlashAttribute("successMessage", "✅ Habitación eliminada correctamente.");
        return "redirect:/tipos";
    }

    @PostMapping("/{id}/crearHabitacion/habitaciones/crear")
    public String crearHabitacion(@ModelAttribute("habitacion") Habitacion habitacion,
                                  @PathVariable Long id,
                                  RedirectAttributes redirectAttributes) {
        habitacionService.crearHabitacion(habitacion, id);
        redirectAttributes.addFlashAttribute("successMessage", "✅ Habitación creada correctamente.");
        return "redirect:/tipos/ver/" + id; 
    }
}
