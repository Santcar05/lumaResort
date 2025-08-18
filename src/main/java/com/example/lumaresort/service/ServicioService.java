package com.example.lumaresort.service;

import java.util.List;

import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.repository.ServicioRepository;

public class ServicioService {

    private ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<Servicio> findAll() {
        return servicioRepository.findAll();
    }

    public Servicio findById(int id) {
        return servicioRepository.findById(id);
    }

    public void save(Servicio servicio) {
        servicioRepository.save(servicio);
    }

    public void delete(int id) {
        servicioRepository.delete(id);
    }

}
