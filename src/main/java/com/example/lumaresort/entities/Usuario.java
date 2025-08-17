package com.example.lumaresort.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String cedula;
    private String telefono;
    private boolean esOperador;
    private boolean esAdministrador;
    private String rol;

    private Cliente cliente;
    private Administrador administrador;
    private Operador operador;
    private Configuracion configuracion;
    private List<Historial> historial;

}
