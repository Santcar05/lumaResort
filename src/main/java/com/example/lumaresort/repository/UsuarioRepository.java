package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Usuario;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Repository
public class UsuarioRepository {

    private Map<Integer, Usuario> usuarios = new HashMap<>();

    public UsuarioRepository() {
        initData();
    }

    private void initData() {
    }

    public List<Usuario> findAll() {
        return new ArrayList<>(usuarios.values());
    }

    public Usuario findById(int id) {
        return usuarios.get(id);
    }

    public void save(Usuario u) {
        usuarios.put(u.getIdUsuario(), u);
    }

    public void delete(int id) {
        usuarios.remove(id);
    }

}
