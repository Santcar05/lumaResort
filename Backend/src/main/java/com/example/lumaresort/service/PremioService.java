package com.example.lumaresort.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.Premio;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.PremioRepository;
import com.example.lumaresort.repository.ReservaRepository;
import com.example.lumaresort.repository.UsuarioRepository;

@Service
public class PremioService {

    @Autowired
    private PremioRepository premioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Premio> findAll() {
        return premioRepository.findAll();
    }

    public Premio save(Premio premio) {
        return premioRepository.save(premio);
    }

    public void delete(Premio premio) {
        premioRepository.delete(premio);
    }

    public Premio findById(Long id) {
        return premioRepository.findById(id).orElse(null);
    }

    // Obtener premios disponibles
    public List<Premio> getPremiosDisponibles() {
        return premioRepository.findByUsuarioIsNull();
    }

    // Obtener premios ganados por un usuario
    public List<Premio> getPremiosByUsuario(Long usuarioId) {
        return premioRepository.findByUsuarioIdUsuario(usuarioId);
    }

    // Obtener premios de una reserva
    public List<Premio> getPremiosByReserva(Long reservaId) {
        return premioRepository.findByReservaIdReserva(reservaId);
    }

    // Asignar premio a un usuario y reserva
    public Premio asignarPremio(Long premioPlantillaId, Long usuarioId, Long reservaId) {
        Premio premioPlantilla = premioRepository.findById(premioPlantillaId).orElse(null);
        if (premioPlantilla == null) {
            return null;
        }

        // Buscar usuario y reserva
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Reserva reserva = reservaRepository.findById(reservaId).orElse(null);

        if (usuario == null || reserva == null) {
            return null;
        }

        // Crear una nueva instancia del premio y asignar al usuario y reserva
        Premio premioAsignado = Premio.builder()
                .nombre(premioPlantilla.getNombre())
                .descripcion(premioPlantilla.getDescripcion())
                .color(premioPlantilla.getColor())
                .icono(premioPlantilla.getIcono())
                .usuario(usuario)
                .reserva(reserva)
                .build();

        return premioRepository.save(premioAsignado);
    }
}
