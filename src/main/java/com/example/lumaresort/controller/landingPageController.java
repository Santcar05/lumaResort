package com.example.lumaresort.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.lumaresort.repository.ServicioRepository;
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

    //http://localhost:8090/servicios
    @GetMapping("/servicios")
    public String servicios(Model model) {
        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "mostrarServicios";
    }

}
