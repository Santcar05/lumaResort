package com.example.lumaresort.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaHabitacion {

    private Integer idCuentaHabitacion;
    private float total;

    private List<Habitacion> habitaciones;
    private List<Servicio> servicios;
    private List<Pago> pagos;
}
