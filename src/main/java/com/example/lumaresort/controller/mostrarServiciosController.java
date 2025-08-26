package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.ServicioRepository;
import com.example.lumaresort.service.ServicioService;

@RequestMapping("/servicios")
@Controller
public class mostrarServiciosController {

    @Autowired
    private Usuario usuario;

    private ServicioService servicioService;

    //http://localhost:8090/servicios
    @GetMapping()
    public String servicios(Model model) {
        servicioService = new ServicioService(new ServicioRepository());
        model.addAttribute("usuario", usuario);

        model.addAttribute("servicios", servicioService.findAll());

        return "tarjetas";
    }

    //http://localhost:8090/servicios?id
    @GetMapping(params = "id")
    public String verServicio(int id, Model model) {
        servicioService = new ServicioService(new ServicioRepository());
        model.addAttribute("servicio", servicioService.findById(id));
        return "verServicio";
    }

    //http://localhost:8090/servicios/tabla
    @GetMapping("/tabla")
    public String tabla(Model model) {
        model.addAttribute("usuario", usuario);

        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "mostrarServicios";
    }

    //http://localhost:8090/servicios/tarjetas
    @GetMapping("/tarjetas")
    public String tarjetas(Model model) {

        model.addAttribute("usuario", usuario);
        servicioService = new ServicioService(new ServicioRepository());

        model.addAttribute("servicios", servicioService.findAll());

        return "tarjetas";
    }
}
