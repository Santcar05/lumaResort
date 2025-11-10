package com.example.lumaresort.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserResponse {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String cedula;
    private String telefono;
    private List<String> roles;
    
    // Constructor para facilitar la creación
    public UserResponse(Long idUsuario, String nombre, String apellido, String correo, 
                       String cedula, String telefono, List<String> roles) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.cedula = cedula;
        this.telefono = telefono;
        this.roles = roles;
    }
}