package com.example.lumaresort.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private OperadorRepository operadorRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {
        init();
    }

    public void init() {

        // ============================
        //  CREAR ROLES
        // ============================
        Role roleCliente = roleRepository.findByNombre(ERole.ROLE_CLIENTE)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CLIENTE)));

        Role roleOperador = roleRepository.findByNombre(ERole.ROLE_OPERADOR)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_OPERADOR)));

        Role roleAdministrador = roleRepository.findByNombre(ERole.ROLE_ADMINISTRADOR)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMINISTRADOR)));

        // ============================
        //  CREAR TIPOS DE HABITACIÓN
        // ============================
        TipoHabitacion tipo1 = TipoHabitacion.builder()
                .nombre("Individual")
                .descripcion("Habitación para una persona")
                .imagenes(Arrays.asList("https://example.com/imagen_individual.jpg"))
                .caracteristicas(Arrays.asList("Cama individual, Baño privado, Wi-Fi gratuito"))
                .precio(50.0)
                .build();

        TipoHabitacion tipo2 = TipoHabitacion.builder()
                .nombre("Doble")
                .descripcion("Habitación para dos personas")
                .imagenes(Arrays.asList("https://example.com/imagen_doble.jpg"))
                .caracteristicas(Arrays.asList("Cama doble, Baño privado, Wi-Fi gratuito, TV por cable"))
                .precio(100.0)
                .build();

        TipoHabitacion tipo3 = TipoHabitacion.builder()
                .nombre("Suite")
                .descripcion("Habitación de lujo con sala de estar")
                .imagenes(Arrays.asList("https://example.com/imagen_suite.jpg"))
                .caracteristicas(Arrays.asList("Cama king size, Sala de estar, Baño con jacuzzi, Wi-Fi gratuito, TV por cable"))
                .precio(200.0)
                .build();

        tipoHabitacionRepository.saveAll(List.of(tipo1, tipo2, tipo3));

        // ============================
        //  CREAR HABITACIONES
        // ============================
        Habitacion habitacion1 = Habitacion.builder()
                .numero("101")
                .precioPorNoche(100.0f)
                .estado("Ocupada")
                .capacidad(1)
                .descripcion("Habitación individual cómoda")
                .tipoHabitacion(tipo1)
                .build();

        Habitacion habitacion2 = Habitacion.builder()
                .numero("102")
                .precioPorNoche(150.0f)
                .estado("Disponible")
                .capacidad(2)
                .descripcion("Habitación doble con vista al mar")
                .tipoHabitacion(tipo2)
                .build();

        Habitacion habitacion3 = Habitacion.builder()
                .numero("201")
                .precioPorNoche(300.0f)
                .estado("Ocupada")
                .capacidad(4)
                .descripcion("Suite de lujo con jacuzzi")
                .tipoHabitacion(tipo3)
                .build();

        habitacionRepository.saveAll(List.of(habitacion1, habitacion2, habitacion3));

        // ============================
        //  CREAR USUARIOS CLIENTES
        // ============================
        for (int i = 1; i <= 10; i++) {
            Usuario usuario = Usuario.builder()
                    .nombre("Usuario" + i)
                    .apellido("Demo")
                    .correo("usuario" + i + "@gmail.com")
                    .contrasena(passwordEncoder.encode("pass" + i))
                    .cedula("100000000" + i)
                    .telefono("300000000" + i)
                    .roles(new ArrayList<>(List.of(roleCliente)))
                    .build();
            Usuario savedUsuario = usuarioRepository.save(usuario);

            // Crear perfil de cliente
            Cliente cliente = new Cliente();
            cliente.setUsuario(savedUsuario);
            clienteRepository.save(cliente);
        }

        // ============================
        //  CREAR USUARIOS OPERADORES
        // ============================
        for (int i = 1; i <= 5; i++) {
            Usuario usuario = Usuario.builder()
                    .nombre("Operador" + i)
                    .apellido("Soporte")
                    .correo("operador" + i + "@gmail.com")
                    .contrasena(passwordEncoder.encode("op" + i))
                    .cedula("200000000" + i)
                    .telefono("310000000" + i)
                    .roles(new ArrayList<>(List.of(roleOperador)))
                    .build();
            Usuario savedUsuario = usuarioRepository.save(usuario);

            // Crear perfil de operador
            Operador operador = new Operador();
            operador.setUsuario(savedUsuario);
            operadorRepository.save(operador);
        }

        // ============================
        //  CREAR USUARIOS ADMINISTRADORES
        // ============================
        for (int i = 1; i <= 5; i++) {
            Usuario usuario = Usuario.builder()
                    .nombre("Admin" + i)
                    .apellido("Luma")
                    .correo("admin" + i + "@gmail.com")
                    .contrasena(passwordEncoder.encode("admin" + i))
                    .cedula("300000000" + i)
                    .telefono("320000000" + i)
                    .roles(new ArrayList<>(List.of(roleAdministrador)))
                    .build();
            Usuario savedUsuario = usuarioRepository.save(usuario);

            // Crear perfil de administrador
            Administrador admin = new Administrador();
            admin.setUsuario(savedUsuario);
            administradorRepository.save(admin);
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
                "CONFIRMADA", usuarioRepository.findByCorreo("usuario1@gmail.com"), habitacion1);

        Reserva reserva2 = new Reserva(new Date(2023 - 1900, 11, 10), new Date(2023 - 1900, 11, 15), 4,
                "PENDIENTE", usuarioRepository.findByCorreo("usuario2@gmail.com"), habitacion2);

        reservaRepository.saveAll(List.of(reserva1, reserva2));

        System.out.println("Inicialización de base de datos DEFAULT completada con sistema de Roles");
    }
}
