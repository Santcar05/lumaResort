package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Cliente;

@Repository
public class ClienteRepository {

    private List<Cliente> clientes = new ArrayList<>();

    public ClienteRepository() {
        initData();
    }

    private void initData() {
        clientes.add(new Cliente(1, null, new ArrayList<>()));
        clientes.add(new Cliente(2, null, new ArrayList<>()));
        clientes.add(new Cliente(3, null, new ArrayList<>()));
        clientes.add(new Cliente(4, null, new ArrayList<>()));
        clientes.add(new Cliente(5, null, new ArrayList<>()));
    }

    public List<Cliente> findAll() {
        return clientes;
    }

    public Cliente findById(int id) {
        return clientes.stream().filter(c -> c.getIdCliente() == id).findFirst().orElse(null);
    }

    public void save(Cliente c) {
        clientes.add(c);
    }
}
