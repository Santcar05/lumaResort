package com.example.lumaresort.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.repository.ServicioRepository;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<Servicio> findAll() {
        return servicioRepository.findAll();
    }

    public Optional<Servicio> findById(Long id) {
        return servicioRepository.findById(id);
    }

    public void save(Servicio servicio) {
        servicioRepository.save(servicio);
    }

    public void delete(Long id) {
        servicioRepository.deleteById(id);
    }

}
