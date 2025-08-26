package com.example.lumaresort.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Historial;

@Repository
public interface HistorialRepository extends JpaRepository<Historial, Long> {

}
