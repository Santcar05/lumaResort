package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import com.example.lumaresort.entities.Configuracion;

public class ConfiguracionRepository {

    private List<Configuracion> configuraciones = new ArrayList<>();

    public ConfiguracionRepository() {
        initData();
    }

    private void initData() {
        configuraciones.add(new Configuracion(1, true, "ES", Configuracion.TemaVisual.CLARO));
        configuraciones.add(new Configuracion(2, false, "EN", Configuracion.TemaVisual.OSCURO));
        configuraciones.add(new Configuracion(3, true, "FR", Configuracion.TemaVisual.AUTOMATICO));
        configuraciones.add(new Configuracion(4, false, "IT", Configuracion.TemaVisual.CLARO));
        configuraciones.add(new Configuracion(5, true, "DE", Configuracion.TemaVisual.OSCURO));
    }

    public List<Configuracion> findAll() {
        return configuraciones;
    }

    public Configuracion findById(int id) {
        return configuraciones.stream().filter(c -> c.getId() == id).findFirst().orElse(null);
    }

    public void save(Configuracion c) {
        configuraciones.add(c);
    }
}
