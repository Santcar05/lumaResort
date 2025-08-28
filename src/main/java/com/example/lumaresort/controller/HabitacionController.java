package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.HabitacionService;

@Controller
public class HabitacionController {

    @Autowired
    private Usuario usuario;
    @Autowired
    private HabitacionService habitacionService;

}
