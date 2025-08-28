package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
        return "lista";
    }

    @PostMapping("/crear")
    public String crear(@ModelAttribute TipoHabitacion tipo) {
        service.crear(tipo);
        return "redirect:/tipos";
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormEditar(@PathVariable Long id, Model model) {
        model.addAttribute("tipo", service.buscarPorId(id).orElseThrow());
        return "editar";
    }

    @PostMapping("/actualizar/{id}")
    public String actualizar(@PathVariable Long id, @ModelAttribute TipoHabitacion tipo) {
        service.actualizar(id, tipo);
        return "redirect:/tipos";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return "redirect:/tipos";
    }

    @GetMapping("/ver/{id}")
    public String verDetalle(@PathVariable Long id, Model model) {
        TipoHabitacion tipo = service.buscarPorId(id).orElseThrow();
        model.addAttribute("tipo", tipo);
        model.addAttribute("habitaciones", tipo.getHabitaciones());
        return "detalle"; // <- este es el nombre de la nueva plantilla detalle.html
    }

    //http://localhost:8090/tipos/{id}/crearHabitacion
    @GetMapping("{id}/crearHabitacion")
    public String crearHabitacion(@PathVariable Long id, Model model) {
        //TipoHabitacion tipo = service.buscarPorId(id).orElseThrow();
        //model.addAttribute("tipo", tipo);
        model.addAttribute("tipoHabitacionId", id);
        model.addAttribute("habitacion", new com.example.lumaresort.entities.Habitacion());
        return "crearHab";
    }

// Método para mostrar formulario de editar habitación
    @GetMapping("/{tipoId}/editarHabitacion/{habitacionId}")
    public String mostrarFormularioEditarHabitacion(@PathVariable Long tipoId,
            @PathVariable Long habitacionId,
            Model model) {
        Habitacion habitacion = habitacionService.buscarHabitacionPorId(habitacionId);
        model.addAttribute("habitacion", habitacion);
        model.addAttribute("tipoHabitacionId", tipoId);
        model.addAttribute("modoEdicion", true); // Para diferenciar entre crear y editar
        return "crearHab"; // Reutilizar la misma plantilla
    }

// Método para procesar la actualización
    @PostMapping("/{tipoId}/editarHabitacion/{habitacionId}/actualizar")
    public String actualizarHabitacion(@ModelAttribute("habitacion") Habitacion habitacion,
            @PathVariable Long tipoId,
            @PathVariable Long habitacionId) {
        habitacionService.actualizarHabitacion(habitacionId, habitacion, tipoId);
        return "redirect:/tipos/ver/" + tipoId; // Regresar al detalle del tipo
    }

    @GetMapping("/habitaciones/ver/{id}/borrar")
    public String borrarHabitacion(@PathVariable Long id) {
        habitacionService.eliminarHabitacion(id);
        return "redirect:/tipos";
    }

    @PostMapping("/{id}/crearHabitacion/habitaciones/crear")
    public String crearHabitacion(@ModelAttribute("habitacion") Habitacion habitacion, @PathVariable Long id) {
        // Lógica para crear la habitación
        habitacionService.crearHabitacion(habitacion, id);

        return "redirect:/tipos"; // Redirigir a la lista de tipos de habitación
    }

    @GetMapping("tipos/{id}/editar")
    public String editarTipoHabitacion(@PathVariable Long id, Model model) {
        TipoHabitacion tipo = service.buscarPorId(id).orElseThrow();
        model.addAttribute("tipo", tipo);
        return "editar";
    }

}
