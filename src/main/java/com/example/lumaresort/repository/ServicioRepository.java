package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Servicio;

@Repository
public class ServicioRepository {

    private Map<Integer, Servicio> servicios = new HashMap<>();

    public ServicioRepository() {
        initFakeData();
    }

    public void initFakeData() {
        servicios.put(1, new Servicio(1, "Aseo y mantenimiento de la habitación", "Servicio que incluye la limpieza de la habitación, la limpieza de las botellas, el cambio de sában y el mantenimiento de los electrodomésticos", 10, null));
        servicios.put(2, new Servicio(2, "Desayuno", "Desayuno incluye café, té, jugo, frutas y pasteles", 30, null));
        servicios.put(3, new Servicio(3, "Acceso a la piscina", "Puede acceder a la piscina durante las horas de apertura del complejo", 50, null));
        servicios.put(4, new Servicio(4, "Transferencia desde el aeropuerto", "Transferencia desde el aeropuerto hasta el complejo", 80, null));
        servicios.put(5, new Servicio(5, "Tour por el complejo", "Tour por el complejo, con el objetivo de conocer las instalaciones y servicios", 100, null));
        servicios.put(6, new Servicio(6, "Acceso a la sauna", "Puede acceder a la sauna durante las horas de apertura del complejo", 70, null));
        servicios.put(7, new Servicio(7, "Acceso al gimnasio", "Puede acceder al gimnasio durante las horas de apertura del complejo", 90, null));
        servicios.put(8, new Servicio(8, "Acceso a la piscina de verano", "Puede acceder a la piscina de verano durante las horas de apertura del complejo", 120, null));
        servicios.put(9, new Servicio(9, "Acceso a los spa", "Puede acceder a los spa durante las horas de apertura del complejo", 150, null));
        servicios.put(10, new Servicio(10, "Acceso al gimnasio de verano", "Puede acceder al gimnasio de verano durante las horas de apertura del complejo", 180, null));
        servicios.put(11, new Servicio(11, "Acceso a los salones de reuniones", "Puede acceder a los salones de reuniones durante las horas de apertura del complejo", 200, null));
        servicios.put(12, new Servicio(12, "Acceso a la piscina de lujo", "Puede acceder a la piscina de lujo durante las horas de apertura del complejo", 250, null));
        servicios.put(13, new Servicio(13, "Acceso a los salones de baile", "Puede acceder a los salones de baile durante las horas de apertura del complejo", 300, null));
        servicios.put(14, new Servicio(14, "Acceso a la piscina de helio", "Puede acceder a la piscina de helio durante las horas de apertura del complejo", 350, null));
        servicios.put(15, new Servicio(15, "Acceso a los salones de eventos privados", "Puede acceder a los salones de eventos privados durante las horas de apertura del complejo", 400, null));
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
}
