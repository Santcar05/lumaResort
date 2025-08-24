package com.example.lumaresort.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.lumaresort.service.ServicioService;

@Controller
public class landingPageController {

    //Atributos de la clase
    private ServicioService servicioService;

    //http://localhost:8090
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

}
