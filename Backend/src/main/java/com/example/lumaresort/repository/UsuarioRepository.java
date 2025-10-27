package com.example.lumaresort.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.lumaresort.entities.Usuario;
import java.util.List;

import com.example.lumaresort.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreoAndContrasena(String correo, String contrasena);

    public Usuario findByCorreo(String correo);

    List<Usuario> findByRol(String rol);

List<Usuario> findByEsAdministradorTrue();

List<Usuario> findByNombreContainingIgnoreCase(String nombre);


}
