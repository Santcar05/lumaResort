package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Cliente;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Repository
public class ClienteRepository {

    private Map<Integer, Cliente> clientes = new HashMap<>();

    public ClienteRepository() {
        initFakeData();
    }

    public void initFakeData() {

    }

    public List<Cliente> findAll() {
        return new ArrayList<>(clientes.values());
    }

    public Cliente findById(int id) {
        return clientes.get(id);
    }

    public Cliente save(Cliente c) {
        clientes.put(c.getIdCliente(), c);
        return c;
    }

    public void delete(Cliente c) {
        clientes.remove(c.getIdCliente());
    }

    public void update(Cliente c) {
        clientes.put(c.getIdCliente(), c);
    }

}
