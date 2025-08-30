package com.example.lumaresort.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Controller;

import com.example.lumaresort.entities.Administrador;
import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.AdministradorRepository;
import com.example.lumaresort.repository.CuentaHabitacionRepository;
import com.example.lumaresort.repository.HabitacionRepository;
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

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {
        // Aquí puedes agregar la lógica para inicializar la base de datos
        // Por ejemplo, crear tablas, insertar datos iniciales, etc.
        init();
    }

    public void init() {
        // Lógica de inicialización de la base de datos
        //Crear 50 habitaciones, 5 tipos de habitaciones y 10 usuarios
        TipoHabitacion tipo1 = new TipoHabitacion("Individual", "Habitación para una persona");
        TipoHabitacion tipo2 = new TipoHabitacion("Doble", "Habitación para dos personas");
        TipoHabitacion tipo3 = new TipoHabitacion("Suite", "Habitación de lujo con sala de estar");
        TipoHabitacion tipo4 = new TipoHabitacion("Familiar", "Habitación para toda la familia");
        TipoHabitacion tipo5 = new TipoHabitacion("Presidencial", "Habitación de máxima categoría");

        tipoHabitacionRepository.save(tipo1);
        tipoHabitacionRepository.save(tipo2);
        tipoHabitacionRepository.save(tipo3);
        tipoHabitacionRepository.save(tipo4);
        tipoHabitacionRepository.save(tipo5);

        // Aquí puedes agregar más lógica para crear habitaciones y usuarios
        // public Habitacion(String numero, float precioPorNoche, String estado, Integer capacidad, String descripcion, List<String> imagenUrl, TipoHabitacion tipoHabitacion)
        Habitacion habitacion1 = new Habitacion("101", 100.0f, "Disponible", 1, "Habitación individual cómoda", null, tipo1);
        Habitacion habitacion2 = new Habitacion("102", 150.0f, "Disponible", 2, "Habitación doble con vista al mar", null, tipo2);
        Habitacion habitacion3 = new Habitacion("201", 300.0f, "Ocupada", 4, "Suite de lujo con jacuzzi", null, tipo3);
        Habitacion habitacion4 = new Habitacion("202", 200.0f, "Disponible", 4, "Habitación familiar espaciosa", null, tipo4);
        Habitacion habitacion5 = new Habitacion("301", 500.0f, "Disponible", 2, "Habitación presidencial con todas las comodidades", null, tipo5);
        Habitacion habitacion6 = new Habitacion("103", 120.0f, "Disponible", 1, "Habitación individual con balcón", null, tipo1);
        Habitacion habitacion7 = new Habitacion("104", 160.0f, "Ocupada", 2, "Habitación doble con cama king size", null, tipo2);
        Habitacion habitacion8 = new Habitacion("203", 320.0f, "Disponible", 4, "Suite con vista panorámica", null, tipo3);
        Habitacion habitacion9 = new Habitacion("204", 220.0f, "Disponible", 4, "Habitación familiar con dos baños", null, tipo4);
        Habitacion habitacion10 = new Habitacion("302", 520.0f, "Ocupada", 2, "Habitación presidencial con terraza privada", null, tipo5);
        Habitacion habitacion11 = new Habitacion("105", 130.0f, "Disponible", 1, "Habitación individual con escritorio de trabajo", null, tipo1);
        Habitacion habitacion12 = new Habitacion("106", 170.0f, "Disponible", 2, "Habitación doble con sofá cama", null, tipo2);
        Habitacion habitacion13 = new Habitacion("205", 340.0f, "Ocupada", 4, "Suite con sala de estar independiente", null, tipo3);
        Habitacion habitacion14 = new Habitacion("206", 240.0f, "Disponible", 4, "Habitación familiar con cocina pequeña", null, tipo4);
        Habitacion habitacion15 = new Habitacion("303", 540.0f, "Disponible", 2, "Habitación presidencial con chimenea", null, tipo5);
        Habitacion habitacion16 = new Habitacion("107", 140.0f, "Ocupada", 1, "Habitación individual con vista al jardín", null, tipo1);
        Habitacion habitacion17 = new Habitacion("108", 180.0f, "Disponible", 2, "Habitación doble con balcón privado", null, tipo2);
        Habitacion habitacion18 = new Habitacion("207", 360.0f, "Disponible", 4, "Suite con bañera de hidromasaje", null, tipo3);
        Habitacion habitacion19 = new Habitacion("208", 260.0f, "Ocupada", 4, "Habitación familiar con área de juegos para niños", null, tipo4);
        Habitacion habitacion20 = new Habitacion("304", 560.0f, "Disponible", 2, "Habitación presidencial con servicio de mayordomo", null, tipo5);
        Habitacion habitacion21 = new Habitacion("109", 150.0f, "Disponible", 1, "Habitación individual con aire acondicionado", null, tipo1);
        Habitacion habitacion22 = new Habitacion("110", 190.0f, "Ocupada", 2, "Habitación doble con cafetera", null, tipo2);
        Habitacion habitacion23 = new Habitacion("209", 380.0f, "Disponible", 4, "Suite con comedor privado", null, tipo3);
        Habitacion habitacion24 = new Habitacion("210", 280.0f, "Disponible", 4, "Habitación familiar con dos camas matrimoniales", null, tipo4);
        Habitacion habitacion25 = new Habitacion("305", 580.0f, "Ocupada", 2, "Habitación presidencial con jacuzzi privado", null, tipo5);
        Habitacion habitacion26 = new Habitacion("111", 160.0f, "Disponible", 1, "Habitación individual con televisión de pantalla plana", null, tipo1);
        Habitacion habitacion27 = new Habitacion("112", 200.0f, "Disponible", 2, "Habitación doble con minibar", null, tipo2);
        Habitacion habitacion28 = new Habitacion("211", 400.0f, "Ocupada", 4, "Suite con balcón y vista al mar", null, tipo3);
        Habitacion habitacion29 = new Habitacion("212", 300.0f, "Disponible", 4, "Habitación familiar con sofá cama adicional", null, tipo4);
        Habitacion habitacion30 = new Habitacion("306", 600.0f, "Disponible", 2, "Habitación presidencial con sala de reuniones", null, tipo5);
        Habitacion habitacion31 = new Habitacion("113", 170.0f, "Ocupada", 1, "Habitación individual con caja fuerte", null, tipo1);
        Habitacion habitacion32 = new Habitacion("114", 210.0f, "Disponible", 2, "Habitación doble con escritorio", null, tipo2);
        Habitacion habitacion33 = new Habitacion("213", 420.0f, "Disponible", 4, "Suite con chimenea y bañera de hidromasaje", null, tipo3);
        Habitacion habitacion34 = new Habitacion("214", 320.0f, "Ocupada", 4, "Habitación familiar con dos habitaciones separadas", null, tipo4);
        Habitacion habitacion35 = new Habitacion("307", 620.0f, "Disponible", 2, "Habitación presidencial con terraza y vista panorámica", null, tipo5);
        Habitacion habitacion36 = new Habitacion("115", 180.0f, "Disponible", 1, "Habitación individual con conexión Wi-Fi gratuita", null, tipo1);
        Habitacion habitacion37 = new Habitacion("116", 220.0f, "Ocupada", 2, "Habitación doble con cafetera y tetera", null, tipo2);
        Habitacion habitacion38 = new Habitacion("215", 440.0f, "Disponible", 4, "Suite con comedor y sala de estar", null, tipo3);
        Habitacion habitacion39 = new Habitacion("216", 340.0f, "Disponible", 4, "Habitación familiar con área de juegos para niños", null, tipo4);
        Habitacion habitacion40 = new Habitacion("308", 640.0f, "Ocupada", 2, "Habitación presidencial con servicio de mayordomo las 24 horas", null, tipo5);
        Habitacion habitacion41 = new Habitacion("117", 190.0f, "Disponible", 1, "Habitación individual con aire acondicionado y calefacción", null, tipo1);
        Habitacion habitacion42 = new Habitacion("118", 230.0f, "Ocupada", 2, "Habitación doble con balcón y vista al jardín", null, tipo2);
        Habitacion habitacion43 = new Habitacion("217", 460.0f, "Disponible", 4, "Suite con bañera de hidromasaje y ducha separada", null, tipo3);
        Habitacion habitacion44 = new Habitacion("218", 360.0f, "Disponible", 4, "Habitación familiar con dos camas matrimoniales y sofá cama", null, tipo4);
        Habitacion habitacion45 = new Habitacion("309", 660.0f, "Ocupada", 2, "Habitación presidencial con jacuzzi y sala de reuniones", null, tipo5);
        Habitacion habitacion46 = new Habitacion("119", 200.0f, "Disponible", 1, "Habitación individual con televisión de pantalla plana y canales por cable", null, tipo1);
        Habitacion habitacion47 = new Habitacion("120", 240.0f, "Ocupada", 2, "Habitación doble con minibar y cafetera", null, tipo2);
        Habitacion habitacion48 = new Habitacion("219", 480.0f, "Disponible", 4, "Suite con balcón y vista al mar", null, tipo3);
        Habitacion habitacion49 = new Habitacion("220", 380.0f, "Disponible", 4, "Habitación familiar con sofá cama adicional y área de juegos para niños", null, tipo4);
        Habitacion habitacion50 = new Habitacion("310", 680.0f, "Ocupada", 2, "Habitación presidencial con terraza privada y servicio de mayordomo las 24 horas", null, tipo5);

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
        Servicio servicio1 = new Servicio("Spa", "Relájate con nuestro servicio de spa", 50.0f, "https://example.com/spa.jpg");
        Servicio servicio2 = new Servicio("Desayuno Buffet", "Disfruta de un delicioso desayuno buffet", 20.0f, "https://example.com/desayuno.jpg");
        Servicio servicio3 = new Servicio("Cena Romántica", "Cena especial para parejas", 80.0f, "https://example.com/cena.jpg");
        Servicio servicio4 = new Servicio("Tour por la Ciudad", "Explora los principales atractivos turísticos", 40.0f, "https://example.com/tour.jpg");
        Servicio servicio5 = new Servicio("Masaje Relajante", "Alivia el estrés con un masaje profesional", 60.0f, "https://example.com/masaje.jpg");
        Servicio servicio6 = new Servicio("Clase de Yoga", "Participa en una clase de yoga para principiantes", 30.0f, "https://example.com/yoga.jpg");
        Servicio servicio7 = new Servicio("Alquiler de Bicicletas", "Recorre la ciudad en bicicleta", 15.0f, "https://example.com/bicicletas.jpg");
        Servicio servicio8 = new Servicio("Cena de Comida Internacional", "Disfruta de una cena de comida internacional", 100.0f, "https://example.com/comida.jpg");
        Servicio servicio9 = new Servicio("Cena de Comida Local", "Disfruta de una cena de comida local", 100.0f, "https://example.com/comida.jpg");
        Servicio servicio10 = new Servicio("Cena de Comida Internacional", "Disfruta de una cena de comida internacional", 100.0f, "https://example.com/comida.jpg");
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

    }
}
