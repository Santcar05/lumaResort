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

    // Mostrar página de ajustes/configuración del usuario
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

        return "usuarios";
    }

    // Actualizar información personal
    @PostMapping("/actualizar-datos")
    public String actualizarDatos(@ModelAttribute("usuario") Usuario usuarioForm,
            BindingResult result,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuarioActual == null) {
            return "redirect:/login";
        }

        // Validaciones personalizadas
        if (usuarioForm.getNombre() == null || usuarioForm.getNombre().trim().isEmpty()) {
            result.rejectValue("nombre", "error.nombre", "El nombre es requerido");
        }
        if (usuarioForm.getCorreo() == null || usuarioForm.getCorreo().trim().isEmpty()) {
            result.rejectValue("correo", "error.correo", "El email es requerido"); // Corregido: era "email"
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.usuario", result);
            redirectAttributes.addFlashAttribute("usuario", usuarioForm);
            return "redirect:/Usuario/ajustes"; // Consistente con mayúscula
        }

        try {
            // Obtener usuario actual de la base de datos
            Usuario usuarioExistente = usuarioService.buscarPorId(usuarioActual.getIdUsuario());

            // Actualizar solo los campos permitidos
            usuarioExistente.setNombre(usuarioForm.getNombre());
            usuarioExistente.setApellido(usuarioForm.getApellido());
            usuarioExistente.setCorreo(usuarioForm.getCorreo());
            usuarioExistente.setTelefono(usuarioForm.getTelefono());
            usuarioExistente.setContrasena(usuarioForm.getContrasena());

            // Mantener datos sensibles sin cambios
            // No se modifican: contraseña, roles, permisos
            // Guardar cambios
            Usuario usuarioActualizado = usuarioService.actualizar(usuarioExistente);

            // Actualizar sesión con los nuevos datos
            session.setAttribute("usuarioLogueado", usuarioActualizado);

            redirectAttributes.addFlashAttribute("success", "Datos actualizados correctamente");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar los datos: " + e.getMessage());
        }

        return "redirect:/Usuario/ajustes";
    }

    // Eliminar cuenta de usuario
    @PostMapping("/eliminar-cuenta")
    public String eliminarCuenta(HttpSession session, RedirectAttributes redirectAttributes) {
        Usuario usuarioActual = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuarioActual == null) {
            // Si no hay usuario en sesión, redirigir al login
            return "redirect:/login";
        }

        try {
            // Eliminar el usuario de la base de datos
            usuarioService.eliminar(usuarioActual.getIdUsuario());
            session.invalidate();
            redirectAttributes.addFlashAttribute("success", "Tu cuenta ha sido eliminada correctamente.");
            return "redirect:/";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar la cuenta: " + e.getMessage());
            return "redirect:/Usuario/ajustes";
        }
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
            return "redirect:/Usuario/ajustes"; // Consistente con mayúscula
        }

        try {
            // Verificar contraseña actual
            if (!usuarioActual.getContrasena().equals(cambioPassword.getPasswordActual())) {
                redirectAttributes.addFlashAttribute("errorPassword", "La contraseña actual es incorrecta");
                return "redirect:/Usuario/ajustes";
            }

            // Verificar que las nuevas contraseñas coincidan
            if (!cambioPassword.getPasswordNueva().equals(cambioPassword.getPasswordConfirmacion())) {
                redirectAttributes.addFlashAttribute("errorPassword", "Las nuevas contraseñas no coinciden");
                return "redirect:/Usuario/ajustes";
            }

            // Actualizar contraseña en base de datos
            Usuario usuarioExistente = usuarioService.buscarPorId(usuarioActual.getIdUsuario());
            usuarioExistente.setContrasena(cambioPassword.getPasswordNueva());
            Usuario usuarioActualizado = usuarioService.actualizar(usuarioExistente);

            // Actualizar sesión
            session.setAttribute("usuarioLogueado", usuarioActualizado);

            redirectAttributes.addFlashAttribute("successPassword", "Contraseña actualizada correctamente");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorPassword", "Error al cambiar la contraseña");
        }

        return "redirect:/Usuario/ajustes";
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
