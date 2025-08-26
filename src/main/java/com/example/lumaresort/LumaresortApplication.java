package com.example.lumaresort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;

import com.example.lumaresort.entities.Usuario;

@EntityScan(basePackages = "com.example.lumaresort.entities")
@SpringBootApplication
public class LumaresortApplication {

    public static void main(String[] args) {
        SpringApplication.run(LumaresortApplication.class, args);
    }

    //Crear bean
    @Bean
    public Usuario usuario() {
        return new Usuario("", "");
    }

    @Bean
    public Usuario usuarioCrearCuenta() {
        return new Usuario("", "");
    }

}
