package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Administrador;

@Repository
public class AdministradorRepository {

    private List<Administrador> administradores = new ArrayList<>();

    public AdministradorRepository() {
        initData();
    }

    private void initData() {
        administradores.add(new Administrador(1, null));
        administradores.add(new Administrador(2, null));
        administradores.add(new Administrador(3, null));
        administradores.add(new Administrador(4, null));
        administradores.add(new Administrador(5, null));
    }

    public List<Administrador> findAll() {
        return administradores;
    }

    public Administrador findById(int id) {
        return administradores.stream().filter(a -> a.getIdAdministrador() == id).findFirst().orElse(null);
    }

    public void save(Administrador a) {
        administradores.add(a);
    }
}
