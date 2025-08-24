package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.ServicioService;

@Controller
public class landingPageController {

    @Autowired
    private Usuario usuario;

    //Atributos de la clase
    private ServicioService servicioService;

    //http://localhost:8090
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("usuario", usuario);
        return "index";
    }

}
