package com.example.lumaresort.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

}
