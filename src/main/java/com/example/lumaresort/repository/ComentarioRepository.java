package com.example.lumaresort.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Comentario;

@Repository
public class ComentarioRepository {

    Map<Integer, Comentario> comentarios = new HashMap<>();

    public ComentarioRepository() {
        initData();
    }

    private void initData() {
        comentarios.put(1, new Comentario(1, "Excelente servicio", new Date(), 5.0f));
        comentarios.put(2, new Comentario(2, "Muy buen servicio", new Date(), 4.5f));
        comentarios.put(3, new Comentario(3, "Gran servicio", new Date(), 5.0f));
        comentarios.put(4, new Comentario(4, "Falta mejorar el servicio", new Date(), 2.0f));
        comentarios.put(5, new Comentario(5, "Muy buen servicio pero falta mejorar", new Date(), 3.5f));
    }

    public void save(Comentario comentario) {
        comentarios.put(comentario.getIdComentario(), comentario);
    }

    public Comentario findById(Integer id) {
        return comentarios.get(id);
    }

    public Iterable<Comentario> findAll() {
        return comentarios.values();
    }

    public void delete(Integer id) {
        comentarios.remove(id);
    }

}
