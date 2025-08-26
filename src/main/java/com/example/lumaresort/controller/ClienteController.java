package com.example.lumaresort.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.service.ClienteService;

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

        // Foto de perfil de María Fernanda (Gerente)
        String fotoPerfil = "https://static.wikia.nocookie.net/dinosaurkingrockz/images/4/4d/Rica_Matsumoto.jpg/revision/latest/scale-to-width-down/240?cb=20180131212121";
        model.addAttribute("fotoPerfil", fotoPerfil);

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

        // También pasamos la foto al editar
        String fotoPerfil = "https://static.wikia.nocookie.net/dinosaurkingrockz/images/4/4d/Rica_Matsumoto.jpg/revision/latest/scale-to-width-down/240?cb=20180131212121";
        model.addAttribute("fotoPerfil", fotoPerfil);

        return "clientes";
    }
}
