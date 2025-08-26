package com.example.lumaresort.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.repository.TipoHabitacionRepository;

@Service
public class TipoHabitacionService {

    @Autowired
    private TipoHabitacionRepository repository;

    public List<TipoHabitacion> listarTodos() {
        return repository.findAll();
    }

    public Optional<TipoHabitacion> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public TipoHabitacion crear(TipoHabitacion tipo) {
        return repository.save(tipo);
    }

    public TipoHabitacion actualizar(Long id, TipoHabitacion tipoActualizado) {
        return repository.findById(id)
                .map(tipo -> {
                    tipo.setNombre(tipoActualizado.getNombre());
                    tipo.setDescripcion(tipoActualizado.getDescripcion());
                    return repository.save(tipo);
                })
                .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
