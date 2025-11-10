package com.example.lumaresort.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String cedula;
    private String telefono;
    private String rol; // "CLIENTE", "OPERADOR", "ADMIN"
}