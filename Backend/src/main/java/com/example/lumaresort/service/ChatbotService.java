package com.example.lumaresort.service;

import org.springframework.stereotype.Service;

import com.example.lumaresort.entities.Mensaje;
import com.example.lumaresort.repository.HistorialRepository;

@Service
public class ChatbotService {

    private final OpenRouterService openRouterService;
    private final HistorialRepository historialRepository;

    public ChatbotService(OpenRouterService openRouterService, HistorialRepository historialRepository) {
        this.openRouterService = openRouterService;
        this.historialRepository = historialRepository;
    }

    public String procesarMensaje(String mensajeUsuario) {
        // Guardar mensaje del usuario
        historialRepository.save(new Mensaje(mensajeUsuario, true));

        // Obtener respuesta de IA
        String respuestaIA = openRouterService.generarRespuesta(mensajeUsuario);

        // Guardar respuesta del bot
        historialRepository.save(new Mensaje(respuestaIA, false));

        return respuestaIA;
    }
}
