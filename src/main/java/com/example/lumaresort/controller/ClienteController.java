package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.ClienteService;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private Usuario usuario;

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // Listar clientes
    // Listar clientes
@GetMapping
public String listar(Model model) {
    model.addAttribute("clientes", service.listarClientes());
    model.addAttribute("nuevoCliente", new Cliente());
    model.addAttribute("usuarioRegistrado", usuario);

    // Foto de perfil de María Fernanda (Gerente)
    String fotoPerfil = "https://static.wikia.nocookie.net/dinosaurkingrockz/images/4/4d/Rica_Matsumoto.jpg/revision/latest/scale-to-width-down/240?cb=20180131212121";
    model.addAttribute("fotoPerfil", fotoPerfil);

    // 🔹 Activa el botón Clientes en la sidebar
    model.addAttribute("activePage", "clientes");

    return "clientes"; // clientes.html en templates
}

// Editar cliente
@GetMapping("/editar/{id}")
public String editar(@PathVariable Long id, Model model) {
    Cliente cliente = service.buscarPorId(id);
    model.addAttribute("nuevoCliente", cliente);
    model.addAttribute("clientes", service.listarClientes());
    model.addAttribute("usuarioRegistrado", usuario);
    String fotoPerfil = "https://static.wikia.nocookie.net/dinosaurkingrockz/images/4/4d/Rica_Matsumoto.jpg/revision/latest/scale-to-width-down/240?cb=20180131212121";
    model.addAttribute("fotoPerfil", fotoPerfil);
    // Activa el botón Clientes
    model.addAttribute("activePage", "clientes");
    return "clientes";
}


    // Crear o editar
    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Cliente cliente, RedirectAttributes redirectAttrs) {
        service.guardarCliente(cliente);
        redirectAttrs.addFlashAttribute("mensaje", "El cliente se actualizó correctamente.");
        return "redirect:/clientes";
    }

    // Eliminar cliente
    @GetMapping("/borrar/{id}")
    public String eliminarCliente(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        service.borrarCliente(id);
        redirectAttrs.addFlashAttribute("mensajeEliminado", "Cliente eliminado correctamente.");
        return "redirect:/clientes";
    }

    // Editar cliente
    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        Cliente cliente = service.buscarPorId(id);
        model.addAttribute("nuevoCliente", cliente);
        model.addAttribute("clientes", service.listarClientes());
        model.addAttribute("usuarioRegistrado", usuario);

        // También pasamos la foto al editar
        String fotoPerfil = "https://static.wikia.nocookie.net/dinosaurkingrockz/images/4/4d/Rica_Matsumoto.jpg/revision/latest/scale-to-width-down/240?cb=20180131212121";
        model.addAttribute("fotoPerfil", fotoPerfil);

        return "clientes";
    }
}
