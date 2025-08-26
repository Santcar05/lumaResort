package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.ClienteService;
import com.example.lumaresort.service.UsuarioService;

@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private Usuario usuario;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ClienteService service;

    //http://localhost:8090/login
    @GetMapping()
    public String login(Model model) {
        model.addAttribute("usuario", usuario);
        return "login";
    }

    //http://localhost:8090/login
    @PostMapping()
    public String login(@ModelAttribute("usuario") Usuario usuarioF, Model model) {
        Usuario usuarioEncontrado = usuarioService.findByCorreoAndContrasena(usuarioF.getCorreo(), usuarioF.getContrasena());
        Usuario admin = new Usuario("admin@correo.com", "123", true);

        if (admin.getCorreo().equals(usuarioF.getCorreo()) && admin.getContrasena().equals(usuarioF.getContrasena()) && admin.isEsAdministrador()) {
            // Agregamos el objeto necesario para Thymeleaf
            model.addAttribute("nuevoCliente", new Cliente());
            // También lista de clientes si tu plantilla la necesita
            model.addAttribute("clientes", service.listarClientes());
            return "clientes";
        } else if (usuarioEncontrado.getCorreo().equals(usuarioF.getCorreo()) && usuarioEncontrado.getContrasena().equals(usuarioF.getContrasena())) {
            usuario.setCorreo(usuarioF.getCorreo());
            usuario.setContrasena(usuarioF.getContrasena());
            return "index";
        } else {
            return "redirect:/login";
        }
    }

}
