package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Comentario;
import com.example.lumaresort.entities.Servicio;

@Repository
public class ServicioRepository {

    private Map<Integer, Servicio> servicios = new HashMap<>();

    public ServicioRepository() {
        initFakeData();
    }

    public void initFakeData() {

        List<Comentario> lista1 = new ArrayList<>();
        lista1.add(new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        lista1.add(new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        lista1.add(new Comentario(3, "Gran servicio", new Date(), 5.0f));
        lista1.add(new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        lista1.add(new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));

        List<Comentario> lista2 = new ArrayList<>();
        lista2.add(new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        lista2.add(new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        lista2.add(new Comentario(3, "Gran servicio", new Date(), 5.0f));
        lista2.add(new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        lista2.add(new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));

        List<Comentario> lista3 = new ArrayList<>();
        lista3.add(new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        lista3.add(new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        lista3.add(new Comentario(3, "Gran servicio", new Date(), 5.0f));
        lista3.add(new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        lista3.add(new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));

        List<Comentario> lista4 = new ArrayList<>();
        lista4.add(new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        lista4.add(new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        lista4.add(new Comentario(3, "Gran servicio", new Date(), 5.0f));
        lista4.add(new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        lista4.add(new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));

        List<Comentario> lista5 = new ArrayList<>();
        lista5.add(new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        lista5.add(new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        lista5.add(new Comentario(3, "Gran servicio", new Date(), 5.0f));
        lista5.add(new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        lista5.add(new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));

        servicios.put(1, new Servicio(1, "Aseo y mantenimiento de la habitación", "Servicio que incluye la limpieza de la habitación, la limpieza de las botellas, el cambio de sában y el mantenimiento de los electrodomésticos", 10, "https://img.freepik.com/fotos-premium/nota-bienvenida-flores-cama_622301-8107.jpg", lista1, null));
        servicios.put(2, new Servicio(2, "Desayuno", "Desayuno incluye café, té, jugo, frutas y pasteles", 30, "https://mouvair.cl/cdn/shop/articles/desayuno-americano-en-freidora-de-aire-mouvair.jpg?v=1738365462", lista2, null));
        servicios.put(3, new Servicio(3, "Acceso a la piscina", "Puede acceder a la piscina durante las horas de apertura del complejo", 50, "https://content.presspage.com/uploads/685/1920_gracesantorini1-5.jpg?10000", lista3, null));
        servicios.put(4, new Servicio(4, "Transferencia desde el aeropuerto", "Transferencia desde el aeropuerto hasta el complejo", 80, "https://www.nobletransfer.com/upload/news/891t_3ar1g.jpg", lista4, null));
        servicios.put(5, new Servicio(5, "Tour por el complejo", "Tour por el complejo, con el objetivo de conocer las instalaciones y servicios", 100, "https://www.semana.com/resizer/v2/4X6UQINWNVD75NOB5MTJFDUFO4.jpg?auth=5f5f007b78ebf6087dfae43b35ca3d25ceb8e3456a734f58e95324f817ff9828&smart=true&quality=75&width=1280&height=720", lista5, null));
        servicios.put(6, new Servicio(6, "Acceso a la sauna", "Puede acceder a la sauna durante las horas de apertura del complejo", 70, "https://imaginox.com/wp-content/uploads/2024/10/finska-ceremonialni-sauna.jpg", lista1, null));
        servicios.put(7, new Servicio(7, "Acceso al gimnasio", "Puede acceder al gimnasio durante las horas de apertura del complejo", 90, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqk2i5WZ6xM4ogdBNOgpJad8AjpYVqIsiVig&s", lista4, null));
        servicios.put(8, new Servicio(8, "Acceso a la piscina de verano", "Puede acceder a la piscina de verano durante las horas de apertura del complejo", 120, "https://images.ecestaticos.com/Uy1PBvfx8hTkr2COBV1NjoSuJfM=/0x0:1236x780/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F770%2F30a%2F97f%2F77030a97ff3134c227ed6573b4703e2a.jpg", lista2, null));
        servicios.put(9, new Servicio(9, "Acceso a los spa", "Puede acceder a los spa durante las horas de apertura del complejo", 150, "https://cdn-hdhgf.nitrocdn.com/oaiQYbXaUcGXsPXzgEGbeeJbeQjXtTNG/assets/images/optimized/rev-211091b/top10hedonist.com/wp-content/uploads/2024/04/conoce-el-primer-spa.jpeg", lista3, null));
        servicios.put(10, new Servicio(10, "Acceso al gimnasio de verano", "Puede acceder al gimnasio de verano durante las horas de apertura del complejo", 180, "https://media.revistagq.com/photos/5dca99efd19dec0008a42d79/16:9/w_2560%2Cc_limit/Gimansio-Wellness-Sky-Belgrado.jpg", lista4, null));
        servicios.put(11, new Servicio(11, "Acceso a los salones de reuniones", "Puede acceder a los salones de reuniones durante las horas de apertura del complejo", 200, "https://cache.marriott.com/is/image/marriotts7prod/wh-bogwh-studio-1-w-bogot--12315:Feature-Hor?wid=1920&fit=constrain", lista5, null));
        servicios.put(12, new Servicio(12, "Acceso a la piscina de lujo", "Puede acceder a la piscina de lujo durante las horas de apertura del complejo", 250, "https://i.pinimg.com/originals/b5/78/f7/b578f71b74b10579cf0f5545925a97b3.jpg", lista2, null));
        servicios.put(13, new Servicio(13, "Acceso a los salones de baile", "Puede acceder a los salones de baile durante las horas de apertura del complejo", 300, "https://bogota.gov.co/sites/default/files/eventos/2024-09/salonesdebaile-2.png", lista4, null));
        servicios.put(14, new Servicio(14, "Acceso a los salones de eventos privados", "Puede acceder a los salones de eventos privados durante las horas de apertura del complejo", 400, "https://image-tc.galaxy.tf/wijpeg-1dc34z106v9ady8s7gj2kcb4j/rooftop-social-event2.jpg?width=1920", lista3, null));
    }

    public List<Servicio> findAll() {
        return new ArrayList<>(servicios.values());
    }

    public Servicio findById(int id) {
        return servicios.get(id);
    }

    public void save(Servicio servicio) {
        servicios.put(servicio.getIdServicio(), servicio);
    }

    public void delete(int id) {
        servicios.remove(id);
    }

    public void update(Servicio servicio) {
        servicios.put(servicio.getIdServicio(), servicio);
    }
}
