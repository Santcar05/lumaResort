package com.example.lumaresort.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class OpenRouterService {

    private final WebClient webClient;
    private final String model;

    public OpenRouterService(
            @Value("${openrouter.api.url:https://openrouter.ai/api/v1/chat/completions}") String apiUrl,
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.model}") String model) {

        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        this.model = model;
    }

    public String generarRespuesta(String mensajeUsuario) {
        try {
            Map<String, Object> request = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", "Eres Luma, una asistente virtual amigable y profesional."),
                            Map.of("role", "user", "content", mensajeUsuario)
                    )
            );

            JsonNode response = webClient.post()
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            JsonNode choices = response.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }

            return "Lo siento, no recibí una respuesta válida del modelo.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Hubo un error al conectar con el modelo de IA.";
        }
    }
}
