package com.example.lumaresort.Service;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.repository.HabitacionRepository;
import com.example.lumaresort.repository.ReservaRepository;
import com.example.lumaresort.repository.UsuarioRepository;
import com.example.lumaresort.service.ReservaService;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class ReservaServiceTestMockito {

    //Servicio a probar
    @InjectMocks
    private ReservaService reservaService;

    @Mock
    private HabitacionRepository habitacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ReservaRepository reservaRepository;

    @Test
    public void testSave() {
        //Arrange
        // Crear usuario y habitación persistidos
        Usuario usuario = new Usuario();
        Habitacion habitacion = new Habitacion();

        // Si usas repositorios separados:
        usuarioRepository.save(usuario);
        habitacionRepository.save(habitacion);

        Reserva reserva1 = new Reserva(new Date(2023, 10, 1), new Date(2023, 10, 5), 2, "CONFIRMADA", usuario, habitacion);
        //Stub

        when(reservaRepository.save(reserva1)).thenReturn(reserva1);
        //Act

        reservaService.save(reserva1);
        //Assert
        assertNotNull(reserva1);
        assertEquals("CONFIRMADA", reserva1.getEstado());
    }
}
