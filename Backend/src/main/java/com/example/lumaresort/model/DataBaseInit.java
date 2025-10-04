package com.example.lumaresort.model;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Controller;

import com.example.lumaresort.entities.Administrador;
import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.AdministradorRepository;
import com.example.lumaresort.repository.CuentaHabitacionRepository;
import com.example.lumaresort.repository.HabitacionRepository;
import com.example.lumaresort.repository.OperadorRepository;
import com.example.lumaresort.repository.ReservaRepository;
import com.example.lumaresort.repository.ServicioRepository;
import com.example.lumaresort.repository.TipoHabitacionRepository;
import com.example.lumaresort.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Controller
@Transactional
public class DataBaseInit implements ApplicationRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ServicioRepository servicioRepository;
    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private TipoHabitacionRepository tipoHabitacionRepository;
    @Autowired
    private CuentaHabitacionRepository cuentaHabitacionRepository;
    @Autowired
    private AdministradorRepository administradorRepository;
    @Autowired
    private OperadorRepository operadorRepository;
    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {
        // Aquí puedes agregar la lógica para inicializar la base de datos
        // Por ejemplo, crear tablas, insertar datos iniciales, etc.
        init();
    }

    public void init() {
        // Lógica de inicialización de la base de datos
        //Crear 50 habitaciones, 5 tipos de habitaciones y 10 usuarios
        TipoHabitacion tipo1 = new TipoHabitacion("Individual", "Habitación para una persona", java.util.Arrays.asList("https://example.com/imagen_individual.jpg"), java.util.Arrays.asList("Cama individual, Baño privado, Wi-Fi gratuito"), 50.0);
        TipoHabitacion tipo2 = new TipoHabitacion("Doble", "Habitación para dos personas", java.util.Arrays.asList("https://example.com/imagen_doble.jpg"), java.util.Arrays.asList("Cama doble, Baño privado, Wi-Fi gratuito, TV por cable", "Cama doble, Baño privado, Wi-Fi gratuito, TV por cable"), 100.0);
        TipoHabitacion tipo3 = new TipoHabitacion("Suite", "Habitación de lujo con sala de estar", java.util.Arrays.asList("https://example.com/imagen_suite.jpg"), java.util.Arrays.asList("Cama king size, Sala de estar, Baño con jacuzzi, Wi-Fi gratuito, TV por cable", "Cama king size, Sala de estar, Baño con jacuzzi, Wi-Fi gratuito, TV por cable"), 200.0);
        TipoHabitacion tipo4 = new TipoHabitacion("Familiar", "Habitación para toda la familia", java.util.Arrays.asList("https://example.com/imagen_familiar.jpg"), java.util.Arrays.asList("Dos camas dobles, Sofá cama, Baño privado, Wi-Fi gratuito, TV por cable"), 300.0);
        TipoHabitacion tipo5 = new TipoHabitacion("Presidencial", "Habitación de máxima categoría", java.util.Arrays.asList("https://example.com/imagen_presidencial.jpg"), java.util.Arrays.asList("Cama king size, Sala de estar, Comedor, Cocina pequeña, Baño con jacuzzi y ducha separada, Wi-Fi gratuito, TV por cable"), 500.0);

        tipoHabitacionRepository.save(tipo1);
        tipoHabitacionRepository.save(tipo2);
        tipoHabitacionRepository.save(tipo3);
        tipoHabitacionRepository.save(tipo4);
        tipoHabitacionRepository.save(tipo5);

        // Aquí puedes agregar más lógica para crear habitaciones y usuarios
        // public Habitacion(String numero, float precioPorNoche, String estado, Integer capacidad, String descripcion, TipoHabitacion tipoHabitacion)
        Habitacion habitacion1 = new Habitacion("101", 100.0f, "Disponible", 1, "Habitación individual cómoda", tipo1);
        Habitacion habitacion2 = new Habitacion("102", 150.0f, "Disponible", 2, "Habitación doble con vista al mar", tipo2);
        Habitacion habitacion3 = new Habitacion("201", 300.0f, "Ocupada", 4, "Suite de lujo con jacuzzi", tipo3);
        Habitacion habitacion4 = new Habitacion("202", 200.0f, "Disponible", 4, "Habitación familiar espaciosa", tipo4);
        Habitacion habitacion5 = new Habitacion("301", 500.0f, "Disponible", 2, "Habitación presidencial con todas las comodidades", tipo5);
        Habitacion habitacion6 = new Habitacion("103", 120.0f, "Disponible", 1, "Habitación individual con balcón", tipo1);
        Habitacion habitacion7 = new Habitacion("104", 160.0f, "Ocupada", 2, "Habitación doble con cama king size", tipo2);
        Habitacion habitacion8 = new Habitacion("203", 320.0f, "Disponible", 4, "Suite con vista panorámica", tipo3);
        Habitacion habitacion9 = new Habitacion("204", 220.0f, "Disponible", 4, "Habitación familiar con dos baños", tipo4);
        Habitacion habitacion10 = new Habitacion("302", 520.0f, "Ocupada", 2, "Habitación presidencial con terraza privada", tipo5);
        Habitacion habitacion11 = new Habitacion("105", 130.0f, "Disponible", 1, "Habitación individual con escritorio de trabajo", tipo1);
        Habitacion habitacion12 = new Habitacion("106", 170.0f, "Disponible", 2, "Habitación doble con sofá cama", tipo2);
        Habitacion habitacion13 = new Habitacion("205", 340.0f, "Ocupada", 4, "Suite con sala de estar independiente", tipo3);
        Habitacion habitacion14 = new Habitacion("206", 240.0f, "Disponible", 4, "Habitación familiar con cocina pequeña", tipo4);
        Habitacion habitacion15 = new Habitacion("303", 540.0f, "Disponible", 2, "Habitación presidencial con chimenea", tipo5);
        Habitacion habitacion16 = new Habitacion("107", 140.0f, "Ocupada", 1, "Habitación individual con vista al jardín", tipo1);
        Habitacion habitacion17 = new Habitacion("108", 180.0f, "Disponible", 2, "Habitación doble con balcón privado", tipo2);
        Habitacion habitacion18 = new Habitacion("207", 360.0f, "Disponible", 4, "Suite con bañera de hidromasaje", tipo3);
        Habitacion habitacion19 = new Habitacion("208", 260.0f, "Ocupada", 4, "Habitación familiar con área de juegos para niños", tipo4);
        Habitacion habitacion20 = new Habitacion("304", 560.0f, "Disponible", 2, "Habitación presidencial con servicio de mayordomo", tipo5);
        Habitacion habitacion21 = new Habitacion("109", 150.0f, "Disponible", 1, "Habitación individual con aire acondicionado", tipo1);
        Habitacion habitacion22 = new Habitacion("110", 190.0f, "Ocupada", 2, "Habitación doble con cafetera", tipo2);
        Habitacion habitacion23 = new Habitacion("209", 380.0f, "Disponible", 4, "Suite con comedor privado", tipo3);
        Habitacion habitacion24 = new Habitacion("210", 280.0f, "Disponible", 4, "Habitación familiar con dos camas matrimoniales", tipo4);
        Habitacion habitacion25 = new Habitacion("305", 580.0f, "Ocupada", 2, "Habitación presidencial con jacuzzi privado", tipo5);
        Habitacion habitacion26 = new Habitacion("111", 160.0f, "Disponible", 1, "Habitación individual con televisión de pantalla plana", tipo1);
        Habitacion habitacion27 = new Habitacion("112", 200.0f, "Disponible", 2, "Habitación doble con minibar", tipo2);
        Habitacion habitacion28 = new Habitacion("211", 400.0f, "Ocupada", 4, "Suite con balcón y vista al mar", tipo3);
        Habitacion habitacion29 = new Habitacion("212", 300.0f, "Disponible", 4, "Habitación familiar con sofá cama adicional", tipo4);
        Habitacion habitacion30 = new Habitacion("306", 600.0f, "Disponible", 2, "Habitación presidencial con sala de reuniones", tipo5);
        Habitacion habitacion31 = new Habitacion("113", 170.0f, "Ocupada", 1, "Habitación individual con caja fuerte", tipo1);
        Habitacion habitacion32 = new Habitacion("114", 210.0f, "Disponible", 2, "Habitación doble con escritorio", tipo2);
        Habitacion habitacion33 = new Habitacion("213", 420.0f, "Disponible", 4, "Suite con chimenea y bañera de hidromasaje", tipo3);
        Habitacion habitacion34 = new Habitacion("214", 320.0f, "Ocupada", 4, "Habitación familiar con dos habitaciones separadas", tipo4);
        Habitacion habitacion35 = new Habitacion("307", 620.0f, "Disponible", 2, "Habitación presidencial con terraza y vista panorámica", tipo5);
        Habitacion habitacion36 = new Habitacion("115", 180.0f, "Disponible", 1, "Habitación individual con conexión Wi-Fi gratuita", tipo1);
        Habitacion habitacion37 = new Habitacion("116", 220.0f, "Ocupada", 2, "Habitación doble con cafetera y tetera", tipo2);
        Habitacion habitacion38 = new Habitacion("215", 440.0f, "Disponible", 4, "Suite con comedor y sala de estar", tipo3);
        Habitacion habitacion39 = new Habitacion("216", 340.0f, "Disponible", 4, "Habitación familiar con área de juegos para niños", tipo4);
        Habitacion habitacion40 = new Habitacion("308", 640.0f, "Ocupada", 2, "Habitación presidencial con servicio de mayordomo las 24 horas", tipo5);
        Habitacion habitacion41 = new Habitacion("117", 190.0f, "Disponible", 1, "Habitación individual con aire acondicionado y calefacción", tipo1);
        Habitacion habitacion42 = new Habitacion("118", 230.0f, "Ocupada", 2, "Habitación doble con balcón y vista al jardín", tipo2);
        Habitacion habitacion43 = new Habitacion("217", 460.0f, "Disponible", 4, "Suite con bañera de hidromasaje y ducha separada", tipo3);
        Habitacion habitacion44 = new Habitacion("218", 360.0f, "Disponible", 4, "Habitación familiar con dos camas matrimoniales y sofá cama", tipo4);
        Habitacion habitacion45 = new Habitacion("309", 660.0f, "Ocupada", 2, "Habitación presidencial con jacuzzi y sala de reuniones", tipo5);
        Habitacion habitacion46 = new Habitacion("119", 200.0f, "Disponible", 1, "Habitación individual con televisión de pantalla plana y canales por cable", tipo1);
        Habitacion habitacion47 = new Habitacion("120", 240.0f, "Ocupada", 2, "Habitación doble con minibar y cafetera", tipo2);
        Habitacion habitacion48 = new Habitacion("219", 480.0f, "Disponible", 4, "Suite con balcón y vista al mar", tipo3);
        Habitacion habitacion49 = new Habitacion("220", 380.0f, "Disponible", 4, "Habitación familiar con sofá cama adicional y área de juegos para niños", tipo4);
        Habitacion habitacion50 = new Habitacion("310", 680.0f, "Ocupada", 2, "Habitación presidencial con terraza privada y servicio de mayordomo las 24 horas", tipo5);

        habitacionRepository.save(habitacion1);
        habitacionRepository.save(habitacion2);
        habitacionRepository.save(habitacion3);
        habitacionRepository.save(habitacion4);
        habitacionRepository.save(habitacion5);
        habitacionRepository.save(habitacion6);
        habitacionRepository.save(habitacion7);
        habitacionRepository.save(habitacion8);
        habitacionRepository.save(habitacion9);
        habitacionRepository.save(habitacion10);
        habitacionRepository.save(habitacion11);
        habitacionRepository.save(habitacion12);
        habitacionRepository.save(habitacion13);
        habitacionRepository.save(habitacion14);
        habitacionRepository.save(habitacion15);
        habitacionRepository.save(habitacion16);
        habitacionRepository.save(habitacion17);
        habitacionRepository.save(habitacion18);
        habitacionRepository.save(habitacion19);
        habitacionRepository.save(habitacion20);
        habitacionRepository.save(habitacion21);
        habitacionRepository.save(habitacion22);
        habitacionRepository.save(habitacion23);
        habitacionRepository.save(habitacion24);
        habitacionRepository.save(habitacion25);
        habitacionRepository.save(habitacion26);
        habitacionRepository.save(habitacion27);
        habitacionRepository.save(habitacion28);
        habitacionRepository.save(habitacion29);
        habitacionRepository.save(habitacion30);
        habitacionRepository.save(habitacion31);
        habitacionRepository.save(habitacion32);
        habitacionRepository.save(habitacion33);
        habitacionRepository.save(habitacion34);
        habitacionRepository.save(habitacion35);
        habitacionRepository.save(habitacion36);
        habitacionRepository.save(habitacion37);
        habitacionRepository.save(habitacion38);
        habitacionRepository.save(habitacion39);
        habitacionRepository.save(habitacion40);
        habitacionRepository.save(habitacion41);
        habitacionRepository.save(habitacion42);
        habitacionRepository.save(habitacion43);
        habitacionRepository.save(habitacion44);
        habitacionRepository.save(habitacion45);
        habitacionRepository.save(habitacion46);
        habitacionRepository.save(habitacion47);
        habitacionRepository.save(habitacion48);
        habitacionRepository.save(habitacion49);
        habitacionRepository.save(habitacion50);

        //Crear 10 usuarios
        //public Usuario(String correo, String contrasena, boolean esAdmin)
        usuarioRepository.save(new Usuario("Usaurio1@gmail.com", "pass1", false));
        usuarioRepository.save(new Usuario("Usaurio2@gmail.com", "pass2", false));
        usuarioRepository.save(new Usuario("Usaurio3@gmail.com", "pass3", false));
        usuarioRepository.save(new Usuario("Usaurio4@gmail.com", "pass4", false));
        usuarioRepository.save(new Usuario("Usaurio5@gmail.com", "pass5", false));
        usuarioRepository.save(new Usuario("Usaurio6@gmail.com", "pass6", false));
        usuarioRepository.save(new Usuario("Usaurio7@gmail.com", "pass7", false));
        usuarioRepository.save(new Usuario("Usaurio8@gmail.com", "pass8", false));
        usuarioRepository.save(new Usuario("Usaurio9@gmail.com", "pass9", false));
        usuarioRepository.save(new Usuario("Usaurio10@gmail.com", "pass10", false));
        //Crear 5 usuarios que serán operadores
        usuarioRepository.save(new Usuario("Operador1@gmail.com", "op1", false, true));
        usuarioRepository.save(new Usuario("Operador2@gmail.com", "op2", false, true));
        usuarioRepository.save(new Usuario("Operador3@gmail.com", "op3", false, true));
        usuarioRepository.save(new Usuario("Operador4@gmail.com", "op4", false, true));
        usuarioRepository.save(new Usuario("Operador5@gmail.com", "op5", false, true));

        //Crear 5 admins
        usuarioRepository.save(new Usuario("admin1@gmail.com", "admin1", true));
        usuarioRepository.save(new Usuario("admin2@gmail.com", "admin2", true));
        usuarioRepository.save(new Usuario("admin3@gmail.com", "admin3", true));
        usuarioRepository.save(new Usuario("admin4@gmail.com", "admin4", true));
        usuarioRepository.save(new Usuario("admin5@gmail.com", "admin5", true));

        //vincular los 5 admins con la tabla administrador
        Administrador admin1 = new Administrador(usuarioRepository.findByCorreoAndContrasena("admin1@gmail.com", "admin1"));
        Administrador admin2 = new Administrador(usuarioRepository.findByCorreoAndContrasena("admin2@gmail.com", "admin2"));
        Administrador admin3 = new Administrador(usuarioRepository.findByCorreoAndContrasena("admin3@gmail.com", "admin3"));
        Administrador admin4 = new Administrador(usuarioRepository.findByCorreoAndContrasena("admin4@gmail.com", "admin4"));
        Administrador admin5 = new Administrador(usuarioRepository.findByCorreoAndContrasena("admin5@gmail.com", "admin5"));

        administradorRepository.save(admin1);
        administradorRepository.save(admin2);
        administradorRepository.save(admin3);
        administradorRepository.save(admin4);
        administradorRepository.save(admin5);

        //Crear 10 CuentaHabitacion
        /* 
        CuentaHabitacion cuenta1 = new CuentaHabitacion(10.0f, null, null, null);
        CuentaHabitacion cuenta2 = new CuentaHabitacion(10.0f, null, null, null);
        CuentaHabitacion cuenta3 = new CuentaHabitacion(20.20f, null, null, null);
        CuentaHabitacion cuenta4 = new CuentaHabitacion(30.0f, null, null, null);
        CuentaHabitacion cuenta5 = new CuentaHabitacion(40.0f, null, null, null);
        CuentaHabitacion cuenta6 = new CuentaHabitacion(50.0f, null, null, null);
        CuentaHabitacion cuenta7 = new CuentaHabitacion(60.0f, null, null, null);
        CuentaHabitacion cuenta8 = new CuentaHabitacion(70.0f, null, null, null);
        CuentaHabitacion cuenta9 = new CuentaHabitacion(80.0f, null, null, null);
        CuentaHabitacion cuenta10 = new CuentaHabitacion(90.0f, null, null, null);

        cuentaHabitacionRepository.save(cuenta1);
        cuentaHabitacionRepository.save(cuenta2);
        cuentaHabitacionRepository.save(cuenta3);
        cuentaHabitacionRepository.save(cuenta4);
        cuentaHabitacionRepository.save(cuenta5);
        cuentaHabitacionRepository.save(cuenta6);
        cuentaHabitacionRepository.save(cuenta7);
        cuentaHabitacionRepository.save(cuenta8);
        cuentaHabitacionRepository.save(cuenta9);
        cuentaHabitacionRepository.save(cuenta10);
         */
        //Crar 50 comentarios
        // nombre, tipo, descripcion, precio, imagenURL
        Servicio servicio1 = new Servicio(
                "Spa",
                "Spa",
                "Relájate con nuestro servicio de spa completo que incluye sauna, jacuzzi y aromaterapia",
                50.0f,
                "https://images.pexels.com/photos/6621436/pexels-photo-6621436.jpeg"
        );

        Servicio servicio2 = new Servicio(
                "Desayuno Buffet",
                "Comida",
                "Comienza tu día con un desayuno buffet internacional ",
                20.0f,
                "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg"
        );

        Servicio servicio3 = new Servicio(
                "Cena Romántica",
                "Comida",
                "Vive una cena romántica inolvidable para dos, con un menú gourmet seleccionada por nuestro sommelier",
                80.0f,
                "https://images.pexels.com/photos/169194/pexels-photo-169194.jpeg"
        );

        Servicio servicio4 = new Servicio(
                "Tour por la Ciudad",
                "Tour",
                "Explora los atractivos turísticos junto con guías expertos que comparten la historia",
                40.0f,
                "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg"
        );

        Servicio servicio5 = new Servicio(
                "Masaje Relajante",
                "Bienestar",
                "Alivia el estrés y revitaliza tu cuerpo con un masaje profesional en nuestras cabinas privadas",
                60.0f,
                "https://images.pexels.com/photos/161477/massage-relax-relaxing-161477.jpeg"
        );

        Servicio servicio6 = new Servicio(
                "Clase de Yoga",
                "Bienestar",
                "Conéctate contigo mismo en nuestras clases de yoga al aire libre, realizadas al amanecer frente al mar.",
                30.0f,
                "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg"
        );

        Servicio servicio7 = new Servicio(
                "Alquiler de Bicicletas",
                "Transporte",
                "Descubre la ciudad y sus alrededores a tu propio ritmo con nuestro servicio de bicicletas",
                15.0f,
                "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg"
        );

        Servicio servicio8 = new Servicio(
                "Cena de Comida Internacional",
                "Comida",
                "Disfruta una cena con platillos de distintas culturas preparados por chefs",
                100.0f,
                "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg"
        );

        Servicio servicio9 = new Servicio(
                "Cena de Comida Local",
                "Comida",
                "Saborea lo mejor de la gastronomía regional en una cena auténtica que incluye entradas tradicionales",
                100.0f,
                "https://images.pexels.com/photos/628776/pexels-photo-628776.jpeg"
        );

        Servicio servicio10 = new Servicio(
                "Cena de Comida Internacional",
                "Comida",
                "Vive una experiencia culinaria sofisticada y una degustación gourmet",
                100.0f,
                "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"
        );

        //Crear 10 servicios
        // public Servicio(String nombre, String descripcion, float precio, String imagenURL, List<Comentario> comentarios, CuentaHabitacion cuentaHabitacion)
        servicioRepository.save(servicio1);
        servicioRepository.save(servicio2);
        servicioRepository.save(servicio3);
        servicioRepository.save(servicio4);
        servicioRepository.save(servicio5);
        servicioRepository.save(servicio6);
        servicioRepository.save(servicio7);
        servicioRepository.save(servicio8);
        servicioRepository.save(servicio9);
        servicioRepository.save(servicio10);

        //Crear 5 operadores
        /*
        @Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Operador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOperador;

    @OneToOne
    @JoinColumn(name = "idUsuario", nullable = false, unique = true)
    private Usuario usuario;
}
} */
 /* 
        Operador operador1 = new Operador(
                1, usuarioRepository.findByCorreoAndContrasena("Operador1@gmail.com", "op1")
        );

        Operador operador2 = new Operador(
                2, usuarioRepository.findByCorreoAndContrasena("Operador2@gmail.com", "op2")
        );

        Operador operador3 = new Operador(
                3, usuarioRepository.findByCorreoAndContrasena("Operador3@gmail.com", "op3")
        );

        Operador operador4 = new Operador(
                4, usuarioRepository.findByCorreoAndContrasena("Operador4@gmail.com", "op4")
        );

        Operador operador5 = new Operador(
                5, usuarioRepository.findByCorreoAndContrasena("Operador5@gmail.com", "op5")
        );

        operadorRepository.save(operador1);
        operadorRepository.save(operador2);
        operadorRepository.save(operador3);
        operadorRepository.save(operador4);
        operadorRepository.save(operador5);

         */
 /*
          @Table(name = "reservas")
                public class Reserva {

                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                private Integer idReserva;

                @Temporal(TemporalType.DATE) // o TIMESTAMP si quieres fecha y hora
                private Date fechaInicio;

                @Temporal(TemporalType.DATE)
                private Date fechaFin;

                private Integer cantidadPersonas;

                private String estado;

                // Relación con Cliente: muchas reservas pueden pertenecer a un cliente
                @JsonIgnore
                @ManyToOne
                @JoinColumn(name = "cliente_id", referencedColumnName = "idCliente")
                private Cliente cliente;
                }
         */
        //Crear 10 reservas
        Reserva reserva1 = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "Confirmada",
                null, habitacion1);
        Reserva reserva2 = new Reserva(new Date(2023, 11, 10), new Date(2023, 11, 15), 4, "Pendiente",
                null, habitacion2);
        Reserva reserva3 = new Reserva(new Date(2023, 12, 20), new Date(2023, 12, 25), 1, "Cancelada",
                null, habitacion3);
        Reserva reserva4 = new Reserva(new Date(2024, 1, 5), new Date(2024, 1, 10), 3, "Confirmada",
                null, habitacion4);
        Reserva reserva5 = new Reserva(new Date(2024, 2, 14), new Date(2024, 2, 18), 2, "Pendiente",
                null, habitacion5);
        Reserva reserva6 = new Reserva(new Date(2024, 3, 1), new Date(2024, 3, 5), 5, "Confirmada",
                null, habitacion6);
        Reserva reserva7 = new Reserva(new Date(2024, 4, 10), new Date(2024, 4, 15), 2, "Cancelada",
                null, habitacion7);
        Reserva reserva8 = new Reserva(new Date(2024, 5, 20), new Date(2024, 5, 25), 4, "Confirmada",
                null, habitacion8);
        Reserva reserva9 = new Reserva(new Date(2024, 6, 15), new Date(2024, 6, 20), 1, "Pendiente",
                null, habitacion9);
        Reserva reserva10 = new Reserva(new Date(2024, 7, 1), new Date(2024, 7, 5), 3, "Confirmada",
                null, habitacion10);
        // Aquí puedes guardar las reservas en su repositorio correspondiente si lo tienes
        reservaRepository.save(reserva1);
        reservaRepository.save(reserva2);
        reservaRepository.save(reserva3);
        reservaRepository.save(reserva4);
        reservaRepository.save(reserva5);
        reservaRepository.save(reserva6);
        reservaRepository.save(reserva7);
        reservaRepository.save(reserva8);
        reservaRepository.save(reserva9);
        reservaRepository.save(reserva10);

    }

}
