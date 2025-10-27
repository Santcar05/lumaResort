package com.example.lumaresort.Repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.UsuarioRepository;

@DataJpaTest
public class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void testFindByCorreoAndContrasena() {
        Usuario u = new Usuario();
        u.setCorreo("test@correo.com");
        u.setContrasena("1234");
        usuarioRepository.save(u);

        Usuario encontrado = usuarioRepository.findByCorreoAndContrasena("test@correo.com", "1234");
        assertThat(encontrado).isNotNull();
    }

    @Test
    void testFindByCorreo() {
        Usuario u = new Usuario();
        u.setCorreo("correo@ejemplo.com");
        u.setContrasena("pass");
        usuarioRepository.save(u);

        Usuario encontrado = usuarioRepository.findByCorreo("correo@ejemplo.com");
        assertThat(encontrado.getCorreo()).isEqualTo("correo@ejemplo.com");
    }

    @Test
    void testFindByRol() {
        Usuario u = new Usuario();
        u.setCorreo("rol@correo.com");
        u.setRol("cliente");
        usuarioRepository.save(u);

        List<Usuario> clientes = usuarioRepository.findByRol("cliente");
        assertThat(clientes).isNotEmpty();
    }

    @Test
    void testFindByEsAdministradorTrue() {
        Usuario admin = new Usuario();
        admin.setCorreo("admin@correo.com");
        admin.setEsAdministrador(true);
        usuarioRepository.save(admin);

        List<Usuario> admins = usuarioRepository.findByEsAdministradorTrue();
        assertThat(admins).extracting("esAdministrador").contains(true);
    }

    @Test
    void testFindByNombreContainingIgnoreCase() {
        Usuario u = new Usuario();
        u.setNombre("Carlos");
        usuarioRepository.save(u);

        List<Usuario> resultado = usuarioRepository.findByNombreContainingIgnoreCase("car");
        assertThat(resultado).isNotEmpty();
    }
}
