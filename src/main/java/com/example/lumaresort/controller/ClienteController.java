package com.example.lumaresort.controller;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.service.ClienteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // Listar clientes
    @GetMapping
    public String listar(Model model) {
        model.addAttribute("clientes", service.listarClientes());
        model.addAttribute("nuevoCliente", new Cliente());
        return "clientes"; // clientes.html en templates
    }

    // Crear o editar
    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Cliente cliente) {
        service.guardarCliente(cliente);
        return "redirect:/clientes";
    }

    // Borrar
    @GetMapping("/borrar/{id}")
    public String borrar(@PathVariable Long id) {
        service.borrarCliente(id);
        return "redirect:/clientes";
    }

    // Editar
    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        Cliente cliente = service.buscarPorId(id);
        model.addAttribute("nuevoCliente", cliente);
        model.addAttribute("clientes", service.listarClientes());
        return "clientes";
    }
}
