package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.service.TipoHabitacionService;

@Controller
@RequestMapping("/tipos")
public class TipoHabitacionController {

    @Autowired
    private TipoHabitacionService service;

    @GetMapping
    public String listarTodos(Model model) {
        model.addAttribute("tipos", service.listarTodos());
        model.addAttribute("tipoNuevo", new TipoHabitacion());
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

}
