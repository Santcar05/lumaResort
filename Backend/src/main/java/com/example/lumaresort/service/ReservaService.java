package com.example.lumaresort.service;

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

}
