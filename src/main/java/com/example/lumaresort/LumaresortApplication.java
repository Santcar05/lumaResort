package com.example.lumaresort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.lumaresort.entities.Usuario;

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

}
