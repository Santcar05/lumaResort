package com.example.lumaresort.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.lumaresort.entities.Mensaje;
import com.example.lumaresort.repository.HistorialRepository;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class OpenRouterService {

    private final WebClient webClient;
    private final String model;
    private final HistorialRepository historialRepository;

    public OpenRouterService(
            @Value("${openrouter.api.url:https://openrouter.ai/api/v1}") String apiUrl,
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.model}") String model,
            HistorialRepository historialRepository) {

        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("HTTP-Referer", "http://localhost:8080") // requerido por OpenRouter
                .defaultHeader("X-Title", "LumaResort Assistant")
                .build();

        this.model = model;
        this.historialRepository = historialRepository;
    }

    public String generarRespuesta(String mensajeUsuario) {
        try {
            // Obtener los mensajes previos(no olvidar los mensjaes previos del usuario)
            List<Mensaje> historial = historialRepository.findAll();

            // Crear el contexto de conversación
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "Eres Luma, una asistente virtual profesional y amigable. Recuerda siempre la información que el usuario te haya dado en la conversación."));

            for (Mensaje msg : historial) {
                messages.add(Map.of(
                        "role", msg.isEsUsuario() ? "user" : "assistant",
                        "content", msg.getContenido()
                ));
            }

            // Agregar el nuevo mensaje del usuario
            messages.add(Map.of("role", "user", "content", mensajeUsuario));

            //Enviar todo el historial
            Map<String, Object> request = Map.of(
                    "model", model,
                    "messages", messages
            );

            JsonNode response = webClient.post()
                    .uri("/chat/completions")
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            System.out.println("📩 Respuesta completa del modelo:\n" + response);

            JsonNode choices = response.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }

            return "Lo siento, no recibí una respuesta válida del modelo.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Hubo un error al conectar con el modelo de IA: " + e.getMessage();
        }
    }
}
