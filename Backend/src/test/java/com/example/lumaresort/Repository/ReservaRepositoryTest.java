package com.example.lumaresort.Repository;

import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.HabitacionRepository;
import com.example.lumaresort.repository.ReservaRepository;
import com.example.lumaresort.repository.UsuarioRepository;

@DataJpaTest
@RunWith(SpringRunner.class)
public class ReservaRepositoryTest {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    public void test_Create() {
        //Arrange
        //----------------------------------------------
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        //Act
        //----------------------------------------------
        reservaRepository.save(reserva);

        //Assert
        //----------------------------------------------
        Assertions.assertNotNull(reserva.getIdReserva());
    }

    @Test
    public void test_FindAll() {
        //Arrange
        //----------------------------------------------
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva1 = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);
        Reserva reserva2 = new Reserva(new Date(2023, 10, 6), new Date(2023, 10, 10), 2, "CONFIRMADA", usuario, habitacion);
        Reserva reserva3 = new Reserva(new Date(2023, 10, 11), new Date(2023, 10, 15), 2, "CONFIRMADA", usuario, habitacion);

        reservaRepository.saveAll(List.of(reserva1, reserva2, reserva3));

        //Act
        //----------------------------------------------
        List<Reserva> reservas = reservaRepository.findAll();
        reservas.forEach(System.out::println);

        //Assert
        //----------------------------------------------
        Assertions.assertEquals(3, reservas.size());
    }

    @Test
    public void test_Delete() {
        //Arrange
        //----------------------------------------------
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        reservaRepository.save(reserva);

        //Act
        //----------------------------------------------
        reservaRepository.delete(reserva);

        //Assert
        //----------------------------------------------
        List<Reserva> reservas = reservaRepository.findAll();
        Assertions.assertEquals(0, reservas.size());
    }

    @Test
    public void test_FindById() {
        //Arrange
        //----------------------------------------------
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        reservaRepository.save(reserva);

        //Act
        //----------------------------------------------
        Reserva reservaEncontrada = reservaRepository.findById(reserva.getIdReserva()).orElse(null);

        //Assert
        //----------------------------------------------
        Assertions.assertNotNull(reservaEncontrada);
    }

    @Test
    public void test_Update() {
        //Arrange
        //----------------------------------------------
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        reservaRepository.save(reserva);

        //Act
        //----------------------------------------------
        reserva.setEstado("CANCELADA");
        reservaRepository.save(reserva);

        //Assert
        //----------------------------------------------
        Reserva reservaEncontrada = reservaRepository.findById(reserva.getIdReserva()).orElse(null);
        Assertions.assertEquals("CANCELADA", reservaEncontrada.getEstado());
    }

}
