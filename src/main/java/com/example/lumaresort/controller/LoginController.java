package com.example.lumaresort.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Usuario;

@Controller
@RequestMapping("/login")
public class LoginController {

    //Crear bean
    @Bean
    public Usuario usuario() {
        return new Usuario();
    }

    @GetMapping()
    public String login(Model model) {
        model.addAttribute("usuario", usuario());
        return "login";
    }

    @PostMapping()
    public String login(@ModelAttribute("usuario") Usuario usuario) {
        //Buscar en la BD si esta en el sistema
        Usuario usuarioEncontrado = new Usuario("abc@gmail.com", "123");//usuarioRepository.findByCorreoAndContrasena(usuario.getCorreo(), usuario.getContrasena());
        //Validar los datos
        //Redireccionar
        if (usuarioEncontrado.getCorreo().equals(usuario.getCorreo()) && usuarioEncontrado.getContrasena().equals(usuario.getContrasena())) {
            return "redirect:/inicioUsuario";
        } else {
            return "redirect:/login";
        }
    }
}
