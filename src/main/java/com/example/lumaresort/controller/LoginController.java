package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private Usuario usuario;

    //http://localhost:8090/login
    @GetMapping()
    public String login(Model model) {
        model.addAttribute("usuario", usuario);
        return "login";
    }

    //http://localhost:8090/login
    @PostMapping()
    public String login(@ModelAttribute("usuario") Usuario usuarioF) {
        //Buscar en la BD si esta en el sistema
        Usuario usuarioEncontrado = new Usuario("abc@gmail.com", "123");//usuarioService.findByCorreoAndContrasena(usuario.getCorreo(), usuario.getContrasena());
        //Validar los datos
        //Redireccionar
        if (usuarioEncontrado.getCorreo().equals(usuarioF.getCorreo()) && usuarioEncontrado.getContrasena().equals(usuarioF.getContrasena())) {
            usuario.setCorreo(usuarioF.getCorreo());
            usuario.setContrasena(usuarioF.getContrasena());
            return "index";
        } else {
            return "redirect:/login";
        }
    }
}
