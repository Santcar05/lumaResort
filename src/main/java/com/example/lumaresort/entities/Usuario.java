package com.example.lumaresort.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String cedula;
    private String telefono;
    private boolean esOperador;
    private boolean esAdministrador;
    private String rol;

    // 🔹 Relaciones con otras entidades
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Cliente cliente;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Administrador administrador;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Operador operador;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Configuracion configuracion;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Historial> historial;

    // 🔹 Constructor adicional (login)
    public Usuario(String correo, String contrasena) {
        this.correo = correo;
        this.contrasena = contrasena;
    }

    public Usuario(String correo, String contrasena, boolean esAdmin) {
        this.correo = correo;
        this.contrasena = contrasena;
        this.esAdministrador = esAdmin;
    }
}
