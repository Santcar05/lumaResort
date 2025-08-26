package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.UsuarioService;

@RequestMapping("/crearUsuario")
@Controller
public class CrearUsuarioController {

    @Autowired
    private Usuario usuarioCrearCuenta;

    @Autowired
    private UsuarioService usuarioService;

    //localhost:8080/crearUsuario
    @GetMapping()
    public String login(Model model) {
        model.addAttribute("usuarioCrearCuenta", usuarioCrearCuenta);
        return "crearUsuario";
    }

    @PostMapping()
    public String crearCuenta(@ModelAttribute("usuarioCrearCuenta") Usuario usuarioF) {

        usuarioService.save(usuarioF);

        this.usuarioCrearCuenta = usuarioF;
        return "index";
    }
}
