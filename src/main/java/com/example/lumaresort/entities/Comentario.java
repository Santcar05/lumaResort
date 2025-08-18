package com.example.lumaresort.entities;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Comentario {

    private Integer idComentario;
    private String comentario;
    private Date fecha;
    private float calificacion;
}
