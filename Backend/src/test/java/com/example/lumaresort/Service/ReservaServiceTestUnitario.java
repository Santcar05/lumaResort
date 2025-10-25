package com.example.lumaresort.Service;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.HabitacionRepository;
import com.example.lumaresort.repository.UsuarioRepository;
import com.example.lumaresort.service.ReservaService;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@ActiveProfiles("test")
public class ReservaServiceTestUnitario {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    public void testFindAll() {
        //Arrange
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva1 = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);
        Reserva reserva2 = new Reserva(new Date(2023, 10, 6), new Date(2023, 10, 10), 2, "CONFIRMADA", usuario, habitacion);
        Reserva reserva3 = new Reserva(new Date(2023, 10, 11), new Date(2023, 10, 15), 2, "CONFIRMADA", usuario, habitacion);

        reservaService.save(reserva1);
        reservaService.save(reserva2);
        reservaService.save(reserva3);
        //Act

        List<Reserva> reservas = reservaService.findAll();

        //Assert
        //Recordar que las pruebas de integracion usa la función de databaseinit de inserción sI NO SE USA LO DE PROFILES
        Assertions.assertEquals(3, reservas.size());

    }

    @Test
    public void testFindById() {
        //Arrange
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        reservaService.save(reserva);

        //Act
        Reserva reservaEncontrada = reservaService.findById(reserva.getIdReserva());

        //Assert
        Assertions.assertNotNull(reservaEncontrada);
    }

    @Test
    public void testSave() {
        //Arrange
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);

        //Act
        reservaService.save(reserva);

        //Assert
        Assertions.assertNotNull(reserva.getIdReserva());
    }
}
