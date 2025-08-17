package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Operador;

@Repository
public class OperadorRepository {

    private List<Operador> operadores = new ArrayList<>();

    public OperadorRepository() {
        initData();
    }

    private void initData() {
        operadores.add(new Operador(1, null));
        operadores.add(new Operador(2, null));
        operadores.add(new Operador(3, null));
        operadores.add(new Operador(4, null));
        operadores.add(new Operador(5, null));
    }

    public List<Operador> findAll() {
        return operadores;
    }

    public Operador findById(int id) {
        return operadores.stream().filter(o -> o.getIdOperador() == id).findFirst().orElse(null);
    }

    public void save(Operador o) {
        operadores.add(o);
    }
}
