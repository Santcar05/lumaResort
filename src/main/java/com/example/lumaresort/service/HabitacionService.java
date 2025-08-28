package com.example.lumaresort.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.HabitacionRepository;

@Service
public class HabitacionService {

    @Autowired
    private Usuario usuario;

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private TipoHabitacionService tipoHabitacionService;

    public Habitacion crearHabitacion(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    //Crear habitacion con tipoHabitacionId
    public Habitacion crearHabitacion(Habitacion habitacion, Long tipoHabitacionId) {
        TipoHabitacion tipoHabitacion = tipoHabitacionService.buscarPorId(tipoHabitacionId).orElseThrow();
        habitacion.setTipoHabitacion(tipoHabitacion);
        return habitacionRepository.save(habitacion);
    }

    public Habitacion buscarHabitacionPorId(Long id) {
        return habitacionRepository.findById(id).orElse(null);
    }

    public Habitacion actualizarHabitacion(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    public void eliminarHabitacion(Long id) {
        habitacionRepository.deleteById(id);
    }

    public void actualizarHabitacion(Long habitacionId, Habitacion habitacion, Long tipoId) {
        Habitacion habitacionExistente = buscarHabitacionPorId(habitacionId);
        TipoHabitacion tipoHabitacion = tipoHabitacionService.buscarPorId(tipoId).orElseThrow();

        if (habitacionExistente != null) {
            habitacionExistente.setNumero(habitacion.getNumero());
            habitacionExistente.setPrecioPorNoche(habitacion.getPrecioPorNoche());
            habitacionExistente.setEstado(habitacion.getEstado());
            habitacionExistente.setTipoHabitacion(tipoHabitacion); // Actualizar el tipo de habitación
            habitacionRepository.save(habitacionExistente);
        }

    }

}
