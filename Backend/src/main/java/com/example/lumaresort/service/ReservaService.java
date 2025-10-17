package com.example.lumaresort.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.repository.ReservaRepository;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public java.util.List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Reserva save(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public void delete(Reserva reserva) {
        reservaRepository.delete(reserva);
    }

    public Reserva findById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public List<Reserva> findByUsuarioId(Long id) {
        return reservaRepository.findByUsuarioIdUsuario(id);
    }
}
