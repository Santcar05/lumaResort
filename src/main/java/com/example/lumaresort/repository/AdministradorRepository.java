package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Administrador;

@Repository
public class AdministradorRepository {

    private Map<Integer, Administrador> administradores = new HashMap<>();

    public AdministradorRepository() {
        initData();
    }

    private void initData() {
    }

    public List<Administrador> findAll() {
        return new ArrayList<>(administradores.values());
    }

    public Administrador findById(int id) {
        return administradores.get(id);
    }

    public Administrador save(Administrador a) {
        administradores.put(a.getIdAdministrador(), a);
        return a;
    }

    public Administrador delete(int id) {
        return administradores.remove(id);
    }

}
