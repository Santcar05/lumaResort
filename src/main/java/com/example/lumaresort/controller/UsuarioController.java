package com.example.lumaresort.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.lumaresort.entities.Usuario;
import com.example.lumaresort.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/Usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    //@Autowired
    //private PasswordEncoder passwordEncoder;
    // Mostrar página de ajustes/configuración del usuario
    @GetMapping
    public String mostrarAjustes(HttpSession session) {
        // Obtener usuario actual de la sesión
        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        return "usuarios";

    }

    @GetMapping("/ajustes")
    public String mostrarAjustes(HttpSession session, Model model) {
        // Obtener usuario actual de la sesión
        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuarioActual == null) {
            return "redirect:/login";
        }

        // Recargar datos actualizados desde la base de datos
        Usuario usuario = usuarioService.buscarPorId(usuarioActual.getIdUsuario());

        model.addAttribute("usuario", usuario);
        model.addAttribute("cambioPassword", new CambioPasswordDTO());

        return "Usuario/ajustes";
    }

    // Actualizar información personal
    @PostMapping("/actualizar-datos")
    public String actualizarDatos(@ModelAttribute Usuario usuario,
            BindingResult result,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuarioActual == null) {
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("error", "Por favor corrige los errores en el formulario");
            return "redirect:/Usuario/ajustes";
        }

        try {
            // Mantener datos sensibles que no deben cambiar
            usuario.setIdUsuario(usuarioActual.getIdUsuario());
            usuario.setContrasena(usuarioActual.getContrasena()); // No cambiar password aquí
            usuario.setEsOperador(usuarioActual.isEsOperador());
            usuario.setEsAdministrador(usuarioActual.isEsAdministrador());
            usuario.setRol(usuarioActual.getRol());

            // Actualizar usuario
            Usuario usuarioActualizado = usuarioService.actualizar(usuario);

            // Actualizar sesión
            session.setAttribute("UsuarioLogueado", usuarioActualizado);

            redirectAttributes.addFlashAttribute("success", "Datos actualizados correctamente");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar los datos: " + e.getMessage());
        }

        return "redirect:/Usuario/ajustes";
    }

    // Cambiar contraseña
    @PostMapping("/cambiar-password")
    public String cambiarPassword(@ModelAttribute CambioPasswordDTO cambioPassword,
            BindingResult result,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuarioActual == null) {
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("errorPassword", "Por favor corrige los errores");
            return "redirect:/usuario/ajustes";
        }

        try {
            // Verificar contraseña actual
            if (!usuarioActual.getContrasena().equals(cambioPassword.getPasswordActual())) {
                redirectAttributes.addFlashAttribute("errorPassword", "La contraseña actual es incorrecta");
                return "redirect:/usuario/ajustes";
            }

            // Verificar que las nuevas contraseñas coincidan
            if (!cambioPassword.getPasswordNueva().equals(cambioPassword.getPasswordConfirmacion())) {
                redirectAttributes.addFlashAttribute("errorPassword", "Las nuevas contraseñas no coinciden");
                return "redirect:/usuario/ajustes";
            }

            // Actualizar contraseña
            usuarioActual.setContrasena(cambioPassword.getPasswordNueva());
            usuarioService.actualizar(usuarioActual);

            redirectAttributes.addFlashAttribute("successPassword", "Contraseña actualizada correctamente");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorPassword", "Error al cambiar la contraseña");
        }

        return "redirect:/usuario/ajustes";
    }

    // DTO para cambio de contraseña
    public static class CambioPasswordDTO {

        private String passwordActual;
        private String passwordNueva;
        private String passwordConfirmacion;

        // Getters y setters
        public String getPasswordActual() {
            return passwordActual;
        }

        public void setPasswordActual(String passwordActual) {
            this.passwordActual = passwordActual;
        }

        public String getPasswordNueva() {
            return passwordNueva;
        }

        public void setPasswordNueva(String passwordNueva) {
            this.passwordNueva = passwordNueva;
        }

        public String getPasswordConfirmacion() {
            return passwordConfirmacion;
        }

        public void setPasswordConfirmacion(String passwordConfirmacion) {
            this.passwordConfirmacion = passwordConfirmacion;
        }
    }
}
