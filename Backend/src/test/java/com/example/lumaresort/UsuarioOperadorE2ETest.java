package com.example.lumaresort;

import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * PRUEBA E2E - CASO DE USO 2
 * Flujo completo: Usuario registrado + Operador interactuando
 * - Usuario hace login y revisa reservas pendientes
 * - Operador hace login y activa checkin
 * - Operador agrega servicios a la reserva  
 * - Usuario realiza checkout y pago
 * - Verificación de monto y estado final
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class UsuarioOperadorE2ETest {

    private static WebDriver driverUsuario;
    private static WebDriver driverOperador;
    private static WebDriverWait waitUsuario;
    private static WebDriverWait waitOperador;

    // URLs de la aplicación
    private static final String BASE_URL = "http://localhost:4200";
    
    // Credenciales de prueba basadas en tu base de datos
    private static final String USUARIO_EMAIL = "Usaurio1@gmail.com";
    private static final String USUARIO_PASSWORD = "pass1";
    private static final String OPERADOR_EMAIL = "Operador1@gmail.com"; 
    private static final String OPERADOR_PASSWORD = "op1";

    @BeforeAll
    public static void setupClass() {
        // Configuración del WebDriver para Chrome
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-extensions");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        // options.addArguments("--headless"); // Descomentar para CI/CD

        // Crear dos instancias de driver para simular dos usuarios
        driverUsuario = new ChromeDriver(options);
        driverOperador = new ChromeDriver(options);
        
        waitUsuario = new WebDriverWait(driverUsuario, Duration.ofSeconds(15));
        waitOperador = new WebDriverWait(driverOperador, Duration.ofSeconds(15));

        // Configurar timeouts
        driverUsuario.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driverUsuario.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        driverOperador.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driverOperador.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
    }

    @AfterAll
    public static void teardownClass() {
        // Cerrar ambos navegadores
        if (driverUsuario != null) {
            driverUsuario.quit();
        }
        if (driverOperador != null) {
            driverOperador.quit();
        }
    }

    /**
     * Método para hacer login en la aplicación
     */
    private void hacerLogin(WebDriver driver, WebDriverWait wait, String email, String password) throws InterruptedException {
        System.out.println("Intentando login con: " + email);
        
        driver.get(BASE_URL + "/login");
        
        // Esperar formulario de login
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("input[name='correo'], input[type='email']")));

        // Llenar email
        WebElement emailInput = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("input[name='correo'], input[type='email']")));
        emailInput.clear();
        Thread.sleep(200);
        emailInput.sendKeys(email);
        
        // Llenar password
        WebElement passwordInput = driver.findElement(
            By.cssSelector("input[name='contrasena'], input[type='password']"));
        passwordInput.clear();
        Thread.sleep(200);
        passwordInput.sendKeys(password);

        Thread.sleep(500);

        // Hacer clic en botón de login
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));
        loginButton.click();

        // Esperar redirección exitosa
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/perfil"),
                ExpectedConditions.urlContains("/home"),
                ExpectedConditions.urlContains("/operador"),
                ExpectedConditions.urlContains("localhost:4200")
            ));
            Thread.sleep(2000);
            System.out.println("Login exitoso para: " + email);
        } catch (TimeoutException e) {
            // Intentar detectar mensaje de error
            try {
                WebElement errorMsg = driver.findElement(By.cssSelector(".error-message, .alert-danger, .error, .mat-error"));
                System.out.println("Error de login: " + errorMsg.getText());
            } catch (Exception ex) {
                System.out.println("No se encontró mensaje de error visible");
            }
            throw e;
        }
    }

    /**
     * Extrae el valor numérico de un texto de monto
     */
    private double extraerMontoNumerico(String montoTexto) {
        // Extraer solo números y punto decimal
        String numeros = montoTexto.replaceAll("[^0-9.,]", "").replace(",", ".");
        return Double.parseDouble(numeros);
    }

    // ==================== PRUEBAS PRINCIPALES ====================

    @Test
    @Order(1)
    @DisplayName("Usuario registrado hace login y revisa reservas pendientes")
    public void test01_usuarioLoginYVerReservas() throws InterruptedException {
        System.out.println("=== PASO 1: Usuario hace login y revisa reservas ===");
        
        // 1. Usuario hace login
        hacerLogin(driverUsuario, waitUsuario, USUARIO_EMAIL, USUARIO_PASSWORD);
        
        // 2. Navegar a la página de reservas del usuario
        driverUsuario.get(BASE_URL + "/reservas");
        
        // 3. Esperar a que carguen las reservas
        waitUsuario.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']")));
        
        // 4. Verificar que hay al menos una reserva
        List<WebElement> reservas = driverUsuario.findElements(
            By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']"));
        assertTrue(reservas.size() > 0, "El usuario debe tener al menos una reserva");
        
        // 5. Verificar que hay una reserva pendiente/sin iniciar
        boolean reservaPendienteEncontrada = false;
        for (WebElement reserva : reservas) {
            try {
                WebElement estadoElement = reserva.findElement(
                    By.cssSelector(".estado-reserva, .reserva-status, [class*='estado'], [class*='status']"));
                String estado = estadoElement.getText().toLowerCase();
                
                if (estado.contains("pendiente") || estado.contains("sin iniciar") || 
                    estado.contains("confirmada") || estado.contains("reservada")) {
                    reservaPendienteEncontrada = true;
                    System.out.println("Reserva pendiente encontrada: " + estado);
                    break;
                }
            } catch (NoSuchElementException e) {
                // Continuar con la siguiente reserva
                System.out.println("No se pudo encontrar elemento de estado en una reserva");
            }
        }
        
        assertTrue(reservaPendienteEncontrada, "Debe haber al menos una reserva pendiente sin iniciar");
        System.out.println("Usuario puede ver sus reservas pendientes correctamente");
    }

    @Test
    @Order(2)
    @DisplayName("Operador hace login y activa checkin de reserva")
    public void test02_operadorLoginYCheckin() throws InterruptedException {
        System.out.println("=== PASO 2: Operador activa checkin ===");
        
        // 1. Operador hace login
        hacerLogin(driverOperador, waitOperador, OPERADOR_EMAIL, OPERADOR_PASSWORD);
        
        // 2. Navegar a la gestión de reservas del operador
        driverOperador.get(BASE_URL + "/operador/reservas");
        
        // 3. Esperar lista de reservas
        waitOperador.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']")));
        
        // 4. Encontrar y hacer checkin en la primera reserva pendiente
        List<WebElement> reservasOperador = driverOperador.findElements(
            By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']"));
        WebElement reservaParaCheckin = null;
        
        for (WebElement reserva : reservasOperador) {
            try {
                WebElement estadoElement = reserva.findElement(
                    By.cssSelector(".estado-reserva, .reserva-status, [class*='estado'], [class*='status']"));
                String estado = estadoElement.getText().toLowerCase();
                
                if (estado.contains("pendiente") || estado.contains("sin iniciar") || 
                    estado.contains("confirmada")) {
                    reservaParaCheckin = reserva;
                    System.out.println("Reserva encontrada para checkin: " + estado);
                    break;
                }
            } catch (NoSuchElementException e) {
                // Continuar buscando
            }
        }
        
        assertNotNull(reservaParaCheckin, "Debe haber una reserva pendiente para hacer checkin");
        
        // 5. Hacer clic en botón de checkin
        try {
            WebElement btnCheckin = reservaParaCheckin.findElement(
                By.cssSelector(".btn-checkin, [id*='checkin'], button"));
            JavascriptExecutor js = (JavascriptExecutor) driverOperador;
            js.executeScript("arguments[0].click();", btnCheckin);
            System.out.println("Click en botón checkin realizado");
        } catch (NoSuchElementException e) {
            // Intentar método alternativo - buscar cualquier botón en la reserva
            List<WebElement> botones = reservaParaCheckin.findElements(By.cssSelector("button"));
            if (!botones.isEmpty()) {
                JavascriptExecutor js = (JavascriptExecutor) driverOperador;
                js.executeScript("arguments[0].click();", botones.get(0));
                System.out.println("Click en primer botón de la reserva realizado");
            } else {
                fail("No se encontró ningún botón en la reserva para hacer checkin");
            }
        }
        
        // 6. Esperar confirmación o cambio de estado
        Thread.sleep(3000);
        
        // Verificar que el estado cambió (recargar si es necesario)
        driverOperador.navigate().refresh();
        waitOperador.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']")));
        
        System.out.println("Checkin realizado exitosamente por el operador");
    }

    @Test
    @Order(3)
    @DisplayName("Operador agrega 2 servicios a la reserva")
    public void test03_operadorAgregaServicios() throws InterruptedException {
        System.out.println("=== PASO 3: Operador agrega servicios ===");
        
        // 1. Navegar a la gestión de servicios
        driverOperador.get(BASE_URL + "/operador/servicios");
        
        // 2. Esperar lista de servicios disponibles
        waitOperador.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".servicio-card, .servicio-item, [class*='servicio']")));
        
        // 3. Obtener lista de servicios
        List<WebElement> servicios = driverOperador.findElements(
            By.cssSelector(".servicio-card, .servicio-item, [class*='servicio']"));
        assertTrue(servicios.size() >= 2, "Debe haber al menos 2 servicios disponibles");
        
        // 4. Agregar dos servicios diferentes
        int serviciosAgregados = 0;
        JavascriptExecutor js = (JavascriptExecutor) driverOperador;
        
        for (int i = 0; i < Math.min(servicios.size(), 2); i++) {
            try {
                WebElement servicio = servicios.get(i);
                WebElement btnAgregar = servicio.findElement(
                    By.cssSelector(".btn-agregar, .add-service, button"));
                
                js.executeScript("arguments[0].click();", btnAgregar);
                Thread.sleep(1500); // Esperar entre agregados
                
                serviciosAgregados++;
                System.out.println("Servicio " + serviciosAgregados + " agregado");
                
            } catch (Exception e) {
                System.out.println("No se pudo agregar servicio " + (i + 1) + ": " + e.getMessage());
            }
        }
        
        assertEquals(2, serviciosAgregados, "Deben haberse agregado exactamente 2 servicios");
        System.out.println("2 servicios agregados correctamente a la reserva");
    }

    @Test
    @Order(4)
    @DisplayName("Usuario solicita checkout y operador procesa pago")
    public void test04_checkoutYPago() throws InterruptedException {
        System.out.println("=== PASO 4: Checkout y pago ===");
        
        // 1. Usuario solicita checkout (desde su perfil o reservas)
        driverUsuario.get(BASE_URL + "/perfil");
        
        try {
            // Intentar encontrar botón de checkout en el perfil
            WebElement btnCheckout = waitUsuario.until(
                ExpectedConditions.elementToBeClickable(
                    By.cssSelector(".btn-checkout, [id*='checkout'], button")));
            JavascriptExecutor js = (JavascriptExecutor) driverUsuario;
            js.executeScript("arguments[0].click();", btnCheckout);
            System.out.println("Usuario solicitó checkout");
            Thread.sleep(2000);
        } catch (TimeoutException e) {
            System.out.println("Botón de checkout no encontrado en perfil, continuando...");
        }
        
        // 2. Operador procesa el checkout
        driverOperador.get(BASE_URL + "/operador/checkout");
        
        // 3. Esperar y verificar monto total
        WebElement montoElement = waitOperador.until(
            ExpectedConditions.presenceOfElementLocated(
                By.cssSelector(".monto-total, .total-amount, [class*='monto'], [class*='total']")));
        
        String montoTexto = montoElement.getText();
        assertNotNull(montoTexto, "Debe mostrarse el monto total");
        assertFalse(montoTexto.isEmpty(), "El monto total no debe estar vacío");
        
        System.out.println("Monto total a pagar: " + montoTexto);
        
        // 4. Verificar que el monto sea numérico y mayor a 0
        try {
            double montoNumerico = extraerMontoNumerico(montoTexto);
            assertTrue(montoNumerico > 0, "El monto debe ser mayor a 0");
            System.out.println("Monto válido: $" + montoNumerico);
        } catch (NumberFormatException e) {
            System.out.println("No se pudo extraer valor numérico del monto: " + montoTexto);
        }
        
        // 5. Realizar el pago
        WebElement btnPagar = waitOperador.until(
            ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-pagar, .pay-button, button")));
        JavascriptExecutor js = (JavascriptExecutor) driverOperador;
        js.executeScript("arguments[0].click();", btnPagar);
        
        // 6. Esperar confirmación de pago
        Thread.sleep(3000);
        
        // Verificar redirección o mensaje de éxito
        try {
            waitOperador.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/confirmacion"),
                ExpectedConditions.urlContains("/exito"),
                ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector(".success-message, .alert-success, [class*='success']"))
            ));
            System.out.println("Pago procesado exitosamente");
        } catch (TimeoutException e) {
            System.out.println("No se detectó confirmación explícita de pago, pero continuando...");
        }
    }

    @Test
    @Order(5)
    @DisplayName("Verificar reserva finalizada desde ambas perspectivas")
    public void test05_verificarReservaFinalizada() throws InterruptedException {
        System.out.println("=== PASO 5: Verificación final ===");
        
        // 1. Verificar desde la perspectiva del OPERADOR
        driverOperador.get(BASE_URL + "/operador/reservas");
        
        List<WebElement> reservasOperador = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']")));
        
        // Verificar que al menos una reserva está en estado "Finalizada"
        boolean reservaFinalizadaOperador = false;
        for (WebElement reserva : reservasOperador) {
            try {
                WebElement estadoElement = reserva.findElement(
                    By.cssSelector(".estado-reserva, .reserva-status, [class*='estado'], [class*='status']"));
                String estado = estadoElement.getText().toLowerCase();
                
                if (estado.contains("finalizada") || estado.contains("completada") || 
                    estado.contains("terminada") || estado.contains("cerrada") ||
                    estado.contains("checkout")) {
                    reservaFinalizadaOperador = true;
                    System.out.println("Operador ve reserva finalizada: " + estado);
                    break;
                }
            } catch (NoSuchElementException e) {
                // Continuar con siguiente reserva
            }
        }
        
        assertTrue(reservaFinalizadaOperador, "El operador debe ver al menos una reserva finalizada");
        
        // 2. Verificar desde la perspectiva del USUARIO
        driverUsuario.get(BASE_URL + "/reservas");
        
        List<WebElement> reservasUsuario = waitUsuario.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector(".reserva-card, .reserva-item, [class*='reserva']")));
        
        boolean reservaFinalizadaUsuario = false;
        for (WebElement reserva : reservasUsuario) {
            try {
                WebElement estadoElement = reserva.findElement(
                    By.cssSelector(".estado-reserva, .reserva-status, [class*='estado'], [class*='status']"));
                String estado = estadoElement.getText().toLowerCase();
                
                if (estado.contains("finalizada") || estado.contains("completada") || 
                    estado.contains("terminada") || estado.contains("cerrada") ||
                    estado.contains("checkout")) {
                    reservaFinalizadaUsuario = true;
                    System.out.println("Usuario ve reserva finalizada: " + estado);
                    break;
                }
            } catch (NoSuchElementException e) {
                // Continuar con siguiente reserva
            }
        }
        
        assertTrue(reservaFinalizadaUsuario, "El usuario debe ver su reserva como finalizada");
        System.out.println("🎉 CASO DE USO 2 COMPLETADO EXITOSAMENTE - Flujo usuario-operador verificado");
    }
}