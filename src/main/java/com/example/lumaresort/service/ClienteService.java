package com.example.lumaresort.service;

import com.example.lumaresort.entities.Cliente;
import com.example.lumaresort.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    public Cliente guardarCliente(Cliente cliente) {
        return repository.save(cliente);
    }

    public void borrarCliente(Long id) {
        repository.deleteById(id);
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}
