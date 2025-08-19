package com.example.lumaresort.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.repository.ServicioRepository;
import com.example.lumaresort.service.ServicioService;

@RequestMapping("/servicios")
@Controller
public class mostrarServiciosController {

    private ServicioService servicioService;

    //http://localhost:8090/servicios
    @GetMapping()
    public String servicios(Model model) {
        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "tarjetas";
    }

    @GetMapping(params = "id")
    public String verServicio(int id, Model model) {
        servicioService = new ServicioService(new ServicioRepository());
        model.addAttribute("servicio", servicioService.findById(id));
        return "verServicio";
    }

    @GetMapping("/tabla")
    public String tabla(Model model) {
        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "mostrarServicios";
    }

    @GetMapping("/tarjetas")
    public String tarjetas(Model model) {
        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "tarjetas";
    }
}
