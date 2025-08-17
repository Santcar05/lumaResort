package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import com.example.lumaresort.entities.Usuario;

public class UsuarioRepository {

    private List<Usuario> usuarios = new ArrayList<>();

    public UsuarioRepository() {
        initData();
    }

    private void initData() {
        usuarios.add(Usuario.builder()
                .idUsuario(1)
                .nombre("Carlos")
                .apellido("Pérez")
                .correo("carlos@mail.com")
                .contrasena("1234")
                .cedula("1001")
                .telefono("3001112233")
                .esOperador(false)
                .esAdministrador(false)
                .build());

        usuarios.add(Usuario.builder()
                .idUsuario(2)
                .nombre("Ana")
                .apellido("Gómez")
                .correo("ana@mail.com")
                .contrasena("abcd")
                .cedula("1002")
                .telefono("3002223344")
                .esOperador(true)
                .esAdministrador(false)
                .build());

        usuarios.add(Usuario.builder()
                .idUsuario(3)
                .nombre("Pedro")
                .apellido("Martínez")
                .correo("pedro@mail.com")
                .contrasena("pass")
                .cedula("1003")
                .telefono("3003334455")
                .esOperador(false)
                .esAdministrador(true)
                .build());

        usuarios.add(Usuario.builder()
                .idUsuario(4)
                .nombre("Laura")
                .apellido("Jiménez")
                .correo("laura@mail.com")
                .contrasena("qwerty")
                .cedula("1004")
                .telefono("3004445566")
                .esOperador(false)
                .esAdministrador(false)
                .build());

        usuarios.add(Usuario.builder()
                .idUsuario(5)
                .nombre("Santiago")
                .apellido("Ramírez")
                .correo("santi@mail.com")
                .contrasena("123abc")
                .cedula("1005")
                .telefono("3005556677")
                .esOperador(false)
                .esAdministrador(false)
                .build());
    }

    public List<Usuario> findAll() {
        return usuarios;
    }

    public Usuario findById(int id) {
        return usuarios.stream().filter(u -> u.getIdUsuario() == id).findFirst().orElse(null);
    }

    public void save(Usuario usuario) {
        usuarios.add(usuario);
    }
}
