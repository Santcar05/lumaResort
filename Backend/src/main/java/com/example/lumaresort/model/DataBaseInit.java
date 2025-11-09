package com.example.lumaresort.model;

import java.util.Date;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;

import com.example.lumaresort.entities.*;
import com.example.lumaresort.repository.*;

import jakarta.transaction.Transactional;

@Controller
@Transactional
@Profile("default")
public class DataBaseInit implements ApplicationRunner {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ServicioRepository servicioRepository;
    @Autowired private HabitacionRepository habitacionRepository;
    @Autowired private TipoHabitacionRepository tipoHabitacionRepository;
    @Autowired private CuentaHabitacionRepository cuentaHabitacionRepository;
    @Autowired private AdministradorRepository administradorRepository;
    @Autowired private OperadorRepository operadorRepository;
    @Autowired private ReservaRepository reservaRepository;

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {
        init();
    }

    public void init() {

        // ============================
        //  CREAR TIPOS DE HABITACIÓN
        // ============================
        TipoHabitacion tipo1 = new TipoHabitacion("Individual", "Habitación para una persona",
                Arrays.asList("https://example.com/imagen_individual.jpg"),
                Arrays.asList("Cama individual, Baño privado, Wi-Fi gratuito"), 50.0);

        TipoHabitacion tipo2 = new TipoHabitacion("Doble", "Habitación para dos personas",
                Arrays.asList("https://example.com/imagen_doble.jpg"),
                Arrays.asList("Cama doble, Baño privado, Wi-Fi gratuito, TV por cable"), 100.0);

        TipoHabitacion tipo3 = new TipoHabitacion("Suite", "Habitación de lujo con sala de estar",
                Arrays.asList("https://example.com/imagen_suite.jpg"),
                Arrays.asList("Cama king size, Sala de estar, Baño con jacuzzi, Wi-Fi gratuito, TV por cable"), 200.0);

        tipoHabitacionRepository.saveAll(List.of(tipo1, tipo2, tipo3));

        // ============================
        //  CREAR HABITACIONES
        // ============================
        Habitacion habitacion1 = new Habitacion("101", 100.0f, "Ocupada", 1, "Habitación individual cómoda", tipo1);
        Habitacion habitacion2 = new Habitacion("102", 150.0f, "Disponible", 2, "Habitación doble con vista al mar", tipo2);
        Habitacion habitacion3 = new Habitacion("201", 300.0f, "Ocupada", 4, "Suite de lujo con jacuzzi", tipo3);

        habitacionRepository.saveAll(List.of(habitacion1, habitacion2, habitacion3));

        // ============================
        //  CREAR USUARIOS con BUILDER
        // ============================

        // 🔹 10 clientes
        for (int i = 1; i <= 10; i++) {
            Usuario cliente = Usuario.builder()
                    .nombre("Usuario" + i)
                    .apellido("Demo")
                    .correo("usuario" + i + "@gmail.com")
                    .contrasena("pass" + i)
                    .esAdministrador(false)
                    .esOperador(false)
                    .rol("CLIENTE")
                    .build();
            usuarioRepository.save(cliente);
        }

        // 🔹 5 operadores
        for (int i = 1; i <= 5; i++) {
            Usuario operador = Usuario.builder()
                    .nombre("Operador" + i)
                    .apellido("Soporte")
                    .correo("operador" + i + "@gmail.com")
                    .contrasena("op" + i)
                    .esAdministrador(false)
                    .esOperador(true)
                    .rol("OPERADOR")
                    .build();
            usuarioRepository.save(operador);
        }

        // 🔹 5 administradores
        for (int i = 1; i <= 5; i++) {
            Usuario admin = Usuario.builder()
                    .nombre("Admin" + i)
                    .apellido("Luma")
                    .correo("admin" + i + "@gmail.com")
                    .contrasena("admin" + i)
                    .esAdministrador(true)
                    .esOperador(false)
                    .rol("ADMIN")
                    .build();
            usuarioRepository.save(admin);
        }

        // ============================
        //  VINCULAR ADMINISTRADORES
        // ============================
        for (int i = 1; i <= 5; i++) {
            Usuario usuarioAdmin = usuarioRepository.findByCorreoAndContrasena("admin" + i + "@gmail.com", "admin" + i);
            Administrador adminEntity = new Administrador(usuarioAdmin);
            administradorRepository.save(adminEntity);
        }

        // ============================
        // 5 CREAR SERVICIOS con COMENTARIOS
        // ============================
        Servicio servicio1 = new Servicio(
                "Spa", "Spa", "Relájate con nuestro servicio de spa completo con sauna y jacuzzi",
                50.0f, "https://images.pexels.com/photos/6621436/pexels-photo-6621436.jpeg");

        Comentario c1 = new Comentario("Excelente servicio, recomendado!", new Date(), 5.0f, servicio1);
        Comentario c2 = new Comentario("Muy relajante y limpio!", new Date(), 4.5f, servicio1);
        servicio1.setComentarios(List.of(c1, c2));

        Servicio servicio2 = new Servicio(
                "Desayuno Buffet", "Comida", "Desayuno internacional con frutas y postres locales",
                25.0f, "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg");

        Comentario c3 = new Comentario("Muy completo y delicioso", new Date(), 5.0f, servicio2);
        servicio2.setComentarios(List.of(c3));

        servicioRepository.saveAll(List.of(servicio1, servicio2));

        // ============================
        //  CREAR RESERVAS DE EJEMPLO
        // ============================
        Reserva reserva1 = new Reserva(new Date(2023 - 1900, 10, 1), new Date(2023 - 1900, 10, 5), 2,
                "CONFIRMADA", usuarioRepository.findByCorreoAndContrasena("usuario1@gmail.com", "pass1"), habitacion1);

        Reserva reserva2 = new Reserva(new Date(2023 - 1900, 11, 10), new Date(2023 - 1900, 11, 15), 4,
                "PENDIENTE", usuarioRepository.findByCorreoAndContrasena("usuario2@gmail.com", "pass2"), habitacion2);

        reservaRepository.saveAll(List.of(reserva1, reserva2));

        System.out.println("Inicialización completada con Builder en Usuario");
    }
}
