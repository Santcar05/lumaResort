package com.example.lumaresort.repository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Configuracion;

@Repository
public class ConfiguracionRepository {

    private Map<Integer, Configuracion> configuraciones = new HashMap<>();

    public ConfiguracionRepository() {
        initData();
    }

    public void initData() {
        configuraciones.put(1, new Configuracion(1, true, "ES", Configuracion.TemaVisual.CLARO));
        configuraciones.put(2, new Configuracion(2, false, "EN", Configuracion.TemaVisual.OSCURO));
        configuraciones.put(3, new Configuracion(3, true, "ES", Configuracion.TemaVisual.OSCURO));
        configuraciones.put(4, new Configuracion(4, false, "EN", Configuracion.TemaVisual.CLARO));
        configuraciones.put(5, new Configuracion(5, true, "ES", Configuracion.TemaVisual.OSCURO));
        configuraciones.put(6, new Configuracion(6, false, "EN", Configuracion.TemaVisual.CLARO));
        configuraciones.put(7, new Configuracion(7, true, "ES", Configuracion.TemaVisual.OSCURO));
        configuraciones.put(8, new Configuracion(8, false, "EN", Configuracion.TemaVisual.CLARO));
        configuraciones.put(9, new Configuracion(9, true, "ES", Configuracion.TemaVisual.OSCURO));
        configuraciones.put(10, new Configuracion(10, false, "EN", Configuracion.TemaVisual.CLARO));

    }

    public Configuracion findById(int id) {
        return configuraciones.get(id);
    }

    public Iterable<Configuracion> findAll() {
        return configuraciones.values();
    }

    public Configuracion save(Configuracion configuracion) {
        configuraciones.put(configuracion.getId(), configuracion);
        return configuracion;
    }

    public void delete(int id) {
        configuraciones.remove(id);
    }

}
