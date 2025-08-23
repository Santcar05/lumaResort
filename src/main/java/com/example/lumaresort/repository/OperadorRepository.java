package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Operador;

@Repository
public class OperadorRepository {

    private Map<Integer, Operador> operadores = new HashMap<>();

    public OperadorRepository() {
        initData();
    }

    private void initData() {
        operadores.put(1, new Operador(1, null));
        operadores.put(2, new Operador(2, null));
        operadores.put(3, new Operador(3, null));
        operadores.put(4, new Operador(4, null));
        operadores.put(5, new Operador(5, null));
    }

    public List<Operador> findAll() {
        return new ArrayList<>(operadores.values());
    }

    public Operador findById(int id) {
        return operadores.get(id);
    }

    public void save(Operador operador) {
        operadores.put(operador.getIdOperador(), operador);
    }

    public void delete(int id) {
        operadores.remove(id);
    }

    public void update(Operador operador) {
        operadores.put(operador.getIdOperador(), operador);
    }

}
