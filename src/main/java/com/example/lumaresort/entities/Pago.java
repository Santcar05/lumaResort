package com.example.lumaresort.entities;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pago {

    private Integer idPago;
    private float monto;
    private Date fecha;
    private String estado;

    private CuentaHabitacion cuentaHabitacion;
    private MetodoPago metodoPago;
}
