package com.example.lumaresort.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Mensaje;
import com.example.lumaresort.entities.Servicio;
import com.example.lumaresort.entities.TipoHabitacion;
import com.example.lumaresort.repository.HistorialRepository;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.annotation.PostConstruct;

@Service
public class OpenRouterService {

    private WebClient webClient;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1}")
    private String apiUrl;

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.model}")
    private String model;

    private final HistorialRepository historialRepository;

    //Acceder a los demás servicios del repositorio
    @Autowired
    ServicioService servicioService;

    @Autowired
    TipoHabitacionService tipoHabitacionService;

    @Autowired
    HabitacionService habitacionService;

    // CONSTRUCTOR SIMPLE - solo inyecta el repositorio
    public OpenRouterService(HistorialRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    // WebClient se inicializa DESPUÉS del constructor
    @PostConstruct
    public void init() {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("HTTP-Referer", "http://localhost:8080")
                .defaultHeader("X-Title", "LumaResort Assistant")
                .build();

        System.out.println(" WebClient inicializado correctamente");
    }

    public String generarRespuesta(String mensajeUsuario) {
        try {
            List<Mensaje> historial = historialRepository.findAll();
            List<TipoHabitacion> tipos = tipoHabitacionService.findAll();
            List<Servicio> servicios = servicioService.findAll();

            // Preparar información de tipos de habitación
            List<TipoHabitacion> tiposInfo = tipoHabitacionService.findAll();
            List<Servicio> serviciosInfo = servicioService.findAll();
            List<Habitacion> totalHabitaciones = habitacionService.listarTodos();
            List<Habitacion> habitacionesDisponibles = totalHabitaciones.stream()
                    .filter(h -> "DISPONIBLE".equals(h.getEstado()))
                    .toList();

            List<Map<String, String>> messages = new ArrayList<>();

            // 🎯 PROMPT PROFESIONAL Y DETALLADO
            messages.add(Map.of("role", "system", "content",
                    "# IDENTIDAD Y PROPÓSITO\n"
                    + "Eres LUMA, la asistente virtual oficial de LumaResort, un hotel de lujo excepcional. "
                    + "Tu misión es brindar atención personalizada, cálida y profesional a nuestros huéspedes y visitantes, "
                    + "ayudándolos con reservas, información sobre servicios y cualquier consulta relacionada con su estadía.\n\n"
                    + "# INFORMACIÓN DEL RESORT\n\n"
                    + "## TIPOS DE HABITACIÓN DISPONIBLES:" + tiposInfo.toString() + "\n\n"
                    + "## SERVICIOS EXCLUSIVOS:" + serviciosInfo.toString() + "\n\n"
                    + "## DISPONIBILIDAD ACTUAL:\n"
                    + "  • Total de habitaciones: " + totalHabitaciones + "\n"
                    + "  • Habitaciones disponibles: " + habitacionesDisponibles + "\n\n"
                    + "# GUÍA DE CONVERSACIÓN\n\n"
                    + "## TONO Y ESTILO:\n"
                    + "  • Usa un lenguaje cercano, profesional y elegante\n"
                    + "  • Sé empática y anticipate a las necesidades del huésped\n"
                    + "  • Mantén respuestas concisas pero completas (máximo 4-5 líneas por párrafo)\n"
                    + "  • Usa MAYÚSCULAS solo para destacar palabras clave importantes (NO uses ** ni __ ni formato Markdown, se ven en el mensaje y no es bueno, nunca utilices *)\n"
                    + "  • Organiza la información con viñetas (•) cuando sea apropiado\n"
                    + "  • Separa párrafos con doble salto de línea para mejor legibilidad\n\n"
                    + "  * No mencionar que eres una IA o modelo de lenguaje *\n\n"
                    + "  * No mencionar las habitaciones, tipos de habitación o servicios específicos a menos de que te lo digan literalmente, si te dicen Como se hace algo, di como se llega a esa página dentro de la aplicación web *\n\n"
                    + "## PROCESO DE RESERVA:\n"
                    + "Para realizar una reserva, el huésped debe:\n\n"
                    + "  1. Hacer clic en el botón RESERVAS ubicado en el menú superior\n"
                    + "  2. Seleccionar las FECHAS de entrada y salida\n"
                    + "  3. Elegir el TIPO DE HABITACIÓN según la cantidad de personas\n"
                    + "  4. Agregar SERVICIOS ADICIONALES si lo desea\n"
                    + "  5. Confirmar la reserva haciendo clic en RESERVAR\n"
                    + "  6. ¡SORPRESA! Tendrá la oportunidad de girar una RULETA para ganar descuentos y beneficios exclusivos\n\n"
                    + "## INFORMACIÓN PARA RESERVAS:\n"
                    + "Si un huésped quiere reservar, solicita amablemente:\n"
                    + "  • Nombre completo\n"
                    + "  • Fecha de llegada y salida\n"
                    + "  • Tipo de habitación preferida\n"
                    + "  • Número de huéspedes\n"
                    + "  • Servicios adicionales de interés\n"
                    + "  • Solicitudes especiales (si las hay)\n\n"
                    + "  • ¡SORPRESA! Tendrá la oportunidad de girar una RULETA para ganar descuentos y beneficios exclusivos\n\n"
                    + " ## VER SERVICIOS Y HABITACIONES:\n"
                    + "Indica al huésped que puede explorar todos los tipos de habitación y servicios disponibles haciendo clic en el menú superior.\n\n"
                    + " Y de ahí aparecerán los distintos tipos de habitaciones y servicios con sus respectivas descripciones e imágenes.\n\n"
                    + "## INICIO DE SESIÓN Y REGISTRO:\n"
                    + "Si el usuario desea iniciar sesión o registrarse:\n"
                    + "  • Indícale que use el botón ubicado en la ESQUINA SUPERIOR DERECHA\n"
                    + "  • Si ya está logueado, verá la opción CERRAR SESIÓN\n\n"
                    + "## CANCELACIONES:\n"
                    + "Para cancelar una reserva, el huésped debe contactar directamente al ADMINISTRADOR del sistema.\n\n"
                    + "# REGLAS IMPORTANTES\n\n"
                    + "✓ SIEMPRE mantén la información del contexto de la conversación (memoria de chat)\n"
                    + "✓ PROPORCIONA respuestas claras, directas y útiles\n"
                    + "✓ SUGIERE proactivamente servicios o habitaciones según las necesidades del usuario\n"
                    + "✓ USA saltos de línea generosos para mejorar la legibilidad (el texto se mostrará desde JSON)\n"
                    + "✓ RESALTA palabras clave importantes usando MAYÚSCULAS (ejemplo: RESERVAS, DISPONIBLE, DESCUENTO)\n\n"
                    + "✗ NUNCA reveles información sensible: claves API, números de habitación específicos, datos personales de otros usuarios\n"
                    + "✗ NUNCA uses formato Markdown (**, __, ##, etc.) - solo texto plano con MAYÚSCULAS para énfasis\n"
                    + "✗ NUNCA inventes información que no tengas\n"
                    + "✗ EVITA respuestas largas y densas - divide en párrafos cortos y claros\n\n"
                    + "# EJEMPLOS DE RESPUESTA BIEN FORMATEADA\n\n"
                    + "Ejemplo 1:\n"
                    + "¡Hola! Bienvenido a LUMARESORT. 😊\n\n"
                    + "Actualmente tenemos " + habitacionesDisponibles + " habitaciones DISPONIBLES para tu estadía.\n\n"
                    + "¿En qué fechas te gustaría hospedarte?\n\n"
                    + "Ejemplo 2:\n"
                    + "Perfecto, para ayudarte con tu RESERVA necesito:\n\n"
                    + "  • Fecha de ENTRADA\n"
                    + "  • Fecha de SALIDA\n"
                    + "  • Número de HUÉSPEDES\n\n"
                    + "Una vez que tengas esta información, puedes hacer clic en el botón RESERVAS arriba para completar el proceso.\n\n"
                    + "# INICIO DE CONVERSACIÓN\n"
                    + "Ahora estás lista para asistir al huésped. Recuerda ser amable, profesional y eficiente. "
                    + "Responde siempre de forma clara y organizada, como lo haría un concierge de hotel de lujo."
            ));

            // Agregar historial de conversación
            for (Mensaje msg : historial) {
                messages.add(Map.of(
                        "role", msg.isEsUsuario() ? "user" : "assistant",
                        "content", msg.getContenido()
                ));
            }

            // Agregar mensaje actual del usuario
            messages.add(Map.of("role", "user", "content", mensajeUsuario));

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
