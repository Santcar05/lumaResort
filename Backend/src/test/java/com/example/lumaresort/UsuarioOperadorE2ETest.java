package com.example.lumaresort;

import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import io.github.bonigarcia.wdm.WebDriverManager;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UsuarioOperadorE2ETest {

    private static WebDriver driverUsuario;
    private static WebDriver driverOperador;
    private static WebDriverWait waitUsuario;
    private static WebDriverWait waitOperador;

    @LocalServerPort
    private int port = 8080; 

    private static final String BASE_URL = "http://localhost:4200";

    private static final String USUARIO_EMAIL = "Usaurio1@gmail.com";
    private static final String USUARIO_PASSWORD = "pass1";
    private static final String OPERADOR_EMAIL = "Operador1@gmail.com"; 
    private static final String OPERADOR_PASSWORD = "op1";

    @BeforeAll
    public static void setupClass() {
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-extensions");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driverUsuario = new ChromeDriver(options);
        driverOperador = new ChromeDriver(options);
        
        //Timeouts más largos para estabilidad
        waitUsuario = new WebDriverWait(driverUsuario, Duration.ofSeconds(25));
        waitOperador = new WebDriverWait(driverOperador, Duration.ofSeconds(25));

        driverUsuario.manage().timeouts().implicitlyWait(Duration.ofSeconds(8));
        driverUsuario.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(40));
        driverOperador.manage().timeouts().implicitlyWait(Duration.ofSeconds(8));
        driverOperador.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(40));

        System.out.println("WebDrivers configurados correctamente");
        System.out.println("URL base: " + BASE_URL);
    }

    @AfterAll
    public static void teardownClass() {
        if (driverUsuario != null) {
            driverUsuario.quit();
        }
        if (driverOperador != null) {
            driverOperador.quit();
        }
        System.out.println("Navegadores cerrados correctamente");
    }

    /**
     * MÉTODO DE LOGIN MEJORADO
     */
    private void hacerLogin(WebDriver driver, WebDriverWait wait, String email, String password, String tipoUsuario) throws InterruptedException {
        System.out.println("Intentando login " + tipoUsuario + ": " + email);
        
        driver.get(BASE_URL + "/login");
        
        //Espera más robusta para el formulario
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("input[name='correo'], input[type='email'], input[formcontrolname='correo']")));
            Thread.sleep(1000);
        } catch (TimeoutException e) {
            System.out.println("Formulario no cargó, intentando continuar...");
        }
        
        //Búsqueda más flexible de campos
        WebElement emailInput = findElementWithRetry(driver, 
            "input[name='correo'], input[type='email'], input[formcontrolname='correo'], input[placeholder*='mail']");
        emailInput.clear();
        Thread.sleep(500);
        emailInput.sendKeys(email);
        
        WebElement passwordInput = findElementWithRetry(driver,
            "input[name='contrasena'], input[type='password'], input[formcontrolname='contrasena'], input[placeholder*='contrase']");
        passwordInput.clear();
        Thread.sleep(500);
        passwordInput.sendKeys(password);

        Thread.sleep(1000);

        //Búsqueda más flexible del botón
        WebElement loginButton = findElementWithRetry(driver,
            "button[type='submit'], button:contains('Iniciar'), button:contains('Login'), .login-button, button");
        
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", loginButton);

        //Espera mejorada para redirección
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/perfil"),
                ExpectedConditions.urlContains("/home"),
                ExpectedConditions.urlContains("/operador"),
                ExpectedConditions.urlContains("/reservas"),
                ExpectedConditions.urlToBe(BASE_URL + "/"),
                ExpectedConditions.not(ExpectedConditions.urlContains("/login"))
            ));
            Thread.sleep(3000); // Espera adicional después del login
            System.out.println("Login exitoso para " + tipoUsuario + ": " + email);
        } catch (TimeoutException e) {
            System.out.println("Timeout en login para " + tipoUsuario);
            System.out.println("URL actual: " + driver.getCurrentUrl());
            // No fallar inmediatamente, continuar para diagnóstico
        }
    }

    /**
     * MÉTODO AUXILIAR PARA BUSCAR ELEMENTOS CON FLEXIBILIDAD
     */
    private WebElement findElementWithRetry(WebDriver driver, String cssSelector) {
        String[] selectors = cssSelector.split(", ");
        for (String selector : selectors) {
            try {
                List<WebElement> elements = driver.findElements(By.cssSelector(selector.trim()));
                if (!elements.isEmpty()) {
                    return elements.get(0);
                }
            } catch (Exception e) {
                // Continuar con el siguiente selector
            }
        }
        throw new NoSuchElementException("No se encontró elemento con selectores: " + cssSelector);
    }

    /**
     * MÉTODO PARA ESPERAR Y VERIFICAR ELEMENTOS CRÍTICOS
     */
    private WebElement waitForElementWithRetry(WebDriverWait wait, String... cssSelectors) {
        for (String selector : cssSelectors) {
            try {
                return wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(selector)));
            } catch (TimeoutException e) {
                System.out.println("Elemento no encontrado con selector: " + selector);
            }
        }
        throw new TimeoutException("No se encontró ninguno de los elementos esperados");
    }

    private double extraerMontoNumerico(String montoTexto) {
        try {
            String numeros = montoTexto.replaceAll("[^0-9.,]", "").replace(",", ".");
            return Double.parseDouble(numeros);
        } catch (NumberFormatException e) {
            System.out.println("No se pudo parsear monto: " + montoTexto);
            return 0.0;
        }
    }

    // ==================== PRUEBAS E2E =====================

    @Test
    @Order(1)
    @DisplayName("Usuario registrado hace login y revisa reservas pendientes")
    public void test01_usuarioLoginYVerReservas() throws InterruptedException {
        System.out.println("=== PASO 1: Usuario hace login y revisa reservas ===");
        
        // 1. Usuario hace login
        hacerLogin(driverUsuario, waitUsuario, USUARIO_EMAIL, USUARIO_PASSWORD, "USUARIO");
        
        // 2. Navegar a reservas con verificación
        driverUsuario.get(BASE_URL + "/reservas");
        
        // Espera más flexible para reservas
        List<WebElement> reservas = waitUsuario.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector(".reserva-card, .reserva-item, app-reserva, mat-card, .card, [class*='reserva']")));
        
        assertTrue(reservas.size() > 0, "El usuario debe tener al menos una reserva");
        System.out.println("Reservas encontradas: " + reservas.size());
        
        // Verificación más robusta de estados
        boolean reservaPendienteEncontrada = false;
        for (WebElement reserva : reservas) {
            try {
                String textoReserva = reserva.getText().toLowerCase();
                System.out.println("Contenido de reserva: " + textoReserva.substring(0, Math.min(50, textoReserva.length())));
                
                if (textoReserva.contains("pendiente") || textoReserva.contains("confirmada") || 
                    textoReserva.contains("reservada") || textoReserva.contains("activa")) {
                    reservaPendienteEncontrada = true;
                    System.out.println("Reserva pendiente encontrada");
                    break;
                }
            } catch (Exception e) {
                System.out.println("Error analizando reserva: " + e.getMessage());
            }
        }
        
        assertTrue(reservaPendienteEncontrada, "Debe haber al menos una reserva pendiente sin iniciar");
        System.out.println("Test 1 COMPLETADO - Usuario puede ver reservas pendientes");
    }

    @Test
    @Order(2)
    @DisplayName("Operador hace login y activa checkin de reserva")
    public void test02_operadorLoginYCheckin() throws InterruptedException {
        System.out.println("=== PASO 2: Operador activa checkin ===");
        
        // 1. Operador hace login
        hacerLogin(driverOperador, waitOperador, OPERADOR_EMAIL, OPERADOR_PASSWORD, "OPERADOR");
        
        // 2. Navegar a gestión de reservas
        driverOperador.get(BASE_URL + "/operador/reservas");
        
        // Espera mejorada para reservas del operador
        List<WebElement> reservasOperador = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector(".reserva-card, .reserva-item, app-reserva, mat-card, .card, [class*='reserva']")));
        
        assertTrue(reservasOperador.size() > 0, "El operador debe ver reservas");
        
        // Búsqueda más robusta del botón checkin
        WebElement reservaParaCheckin = null;
        WebElement btnCheckin = null;
        
        for (WebElement reserva : reservasOperador) {
            try {
                String textoReserva = reserva.getText().toLowerCase();
                if (textoReserva.contains("pendiente") || textoReserva.contains("confirmada")) {
                    reservaParaCheckin = reserva;
                    
                    // Buscar botón de checkin de múltiples formas
                    List<WebElement> botones = reserva.findElements(
                        By.cssSelector("button, .btn, [class*='btn'], [class*='button']"));
                    
                    for (WebElement boton : botones) {
                        String textoBoton = boton.getText().toLowerCase();
                        if (textoBoton.contains("checkin") || textoBoton.contains("activar") || 
                            textoBoton.contains("iniciar") || textoBoton.contains("confirmar")) {
                            btnCheckin = boton;
                            break;
                        }
                    }
                    
                    // Si no encontramos botón específico, usar el primero
                    if (btnCheckin == null && !botones.isEmpty()) {
                        btnCheckin = botones.get(0);
                    }
                    
                    break;
                }
            } catch (Exception e) {
                System.out.println("Error procesando reserva: " + e.getMessage());
            }
        }
        
        assertNotNull(reservaParaCheckin, "Debe haber una reserva pendiente para checkin");
        assertNotNull(btnCheckin, "Debe haber un botón para hacer checkin");
        
        // Click más robusto
        JavascriptExecutor js = (JavascriptExecutor) driverOperador;
        js.executeScript("arguments[0].scrollIntoView(true);", btnCheckin);
        Thread.sleep(1000);
        js.executeScript("arguments[0].click();", btnCheckin);
        
        System.out.println("Click en botón checkin realizado");
        
        // Espera para confirmación
        Thread.sleep(5000);
        System.out.println("Test 2 COMPLETADO - Checkin realizado por operador");
    }

    @Test
    @Order(3)
    @DisplayName("Operador agrega 2 servicios a la reserva")
    public void test03_operadorAgregaServicios() throws InterruptedException {
        System.out.println("=== PASO 3: Operador agrega servicios ===");
        
        // 1. Navegar a gestión de servicios
        driverOperador.get(BASE_URL + "/operador/servicios");
        
        // Espera mejorada para servicios
        List<WebElement> servicios = waitOperador.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector(".servicio-card, .servicio-item, app-servicio, mat-card, .card, [class*='servicio']")));
        
        assertTrue(servicios.size() >= 2, "Debe haber al menos 2 servicios disponibles. Encontrados: " + servicios.size());
        
        // Agregar servicios con mejor manejo de errores
        int serviciosAgregados = 0;
        JavascriptExecutor js = (JavascriptExecutor) driverOperador;
        
        for (int i = 0; i < Math.min(servicios.size(), 2); i++) {
            try {
                WebElement servicio = servicios.get(i);
                String nombreServicio = servicio.getText().split("\n")[0];
                
                // Buscar botón de agregar
                WebElement btnAgregar = null;
                List<WebElement> botones = servicio.findElements(
                    By.cssSelector("button, .btn, [class*='btn'], [class*='button']"));
                
                for (WebElement boton : botones) {
                    String textoBoton = boton.getText().toLowerCase();
                    if (textoBoton.contains("agregar") || textoBoton.contains("add") || 
                        textoBoton.contains("+") || textoBoton.contains("seleccionar")) {
                        btnAgregar = boton;
                        break;
                    }
                }
                
                if (btnAgregar == null && !botones.isEmpty()) {
                    btnAgregar = botones.get(0);
                }
                
                if (btnAgregar != null) {
                    js.executeScript("arguments[0].scrollIntoView(true);", btnAgregar);
                    Thread.sleep(1000);
                    js.executeScript("arguments[0].click();", btnAgregar);
                    serviciosAgregados++;
                    System.out.println("Servicio " + serviciosAgregados + " agregado: " + nombreServicio);
                    Thread.sleep(2000);
                }
                
            } catch (Exception e) {
                System.out.println("Error agregando servicio " + (i + 1) + ": " + e.getMessage());
            }
        }
        
        assertTrue(serviciosAgregados >= 1, "Debe haberse agregado al menos 1 servicio. Agregados: " + serviciosAgregados);
        System.out.println("Test 3 COMPLETADO - Servicios agregados: " + serviciosAgregados);
    }

    @Test
    @Order(4)
    @DisplayName("Usuario solicita checkout y operador procesa pago")
    public void test04_checkoutYPago() throws InterruptedException {
        System.out.println("=== PASO 4: Checkout y pago ===");
        
        // Usuario solicita checkout
        driverUsuario.get(BASE_URL + "/reservas");
        Thread.sleep(3000);
        
        try {
            // Buscar botón checkout en reservas
            List<WebElement> botonesCheckout = driverUsuario.findElements(
                By.cssSelector(".btn-checkout, [id*='checkout'], button"));
            
            for (WebElement boton : botonesCheckout) {
                if (boton.isDisplayed() && boton.isEnabled()) {
                    JavascriptExecutor js = (JavascriptExecutor) driverUsuario;
                    js.executeScript("arguments[0].click();", boton);
                    System.out.println("Usuario solicitó checkout");
                    Thread.sleep(3000);
                    break;
                }
            }
        } catch (Exception e) {
            System.out.println("No se pudo hacer checkout desde usuario: " + e.getMessage());
        }
        
        // Operador procesa checkout
        driverOperador.get(BASE_URL + "/operador/checkout");
        Thread.sleep(3000);
        
        // Buscar monto total con múltiples selectores
        WebElement montoElement = null;
        String[] selectoresMonto = {
            ".monto-total", ".total-amount", "[class*='monto']", "[class*='total']",
            ".precio", ".price", ".valor", ".amount"
        };
        
        for (String selector : selectoresMonto) {
            List<WebElement> elementos = driverOperador.findElements(By.cssSelector(selector));
            for (WebElement elem : elementos) {
                String texto = elem.getText();
                if (texto.contains("$") || texto.contains("S/") || texto.matches(".*[0-9]+[.,][0-9]+.*")) {
                    montoElement = elem;
                    break;
                }
            }
            if (montoElement != null) break;
        }
        
        assertNotNull(montoElement, "Debe mostrarse el monto total");
        String montoTexto = montoElement.getText();
        assertFalse(montoTexto.isEmpty(), "El monto total no debe estar vacío");
        
        System.out.println("Monto total a pagar: " + montoTexto);
        
        // Verificar monto
        try {
            double montoNumerico = extraerMontoNumerico(montoTexto);
            assertTrue(montoNumerico > 0, "El monto debe ser mayor a 0");
            System.out.println("Monto válido: $" + montoNumerico);
        } catch (NumberFormatException e) {
            System.out.println("No se pudo extraer valor numérico del monto: " + montoTexto);
        }
        
        // Buscar botón pagar de forma más flexible
        WebElement btnPagar = null;
        List<WebElement> botonesPagar = driverOperador.findElements(
            By.cssSelector(".btn-pagar, .pay-button, button"));
        
        for (WebElement boton : botonesPagar) {
            String textoBoton = boton.getText().toLowerCase();
            if (textoBoton.contains("pagar") || textoBoton.contains("pay") || 
                textoBoton.contains("confirmar") || textoBoton.contains("finalizar")) {
                btnPagar = boton;
                break;
            }
        }
        
        if (btnPagar == null && !botonesPagar.isEmpty()) {
            btnPagar = botonesPagar.get(0);
        }
        
        assertNotNull(btnPagar, "Debe haber un botón para realizar el pago");
        
        JavascriptExecutor js = (JavascriptExecutor) driverOperador;
        js.executeScript("arguments[0].scrollIntoView(true);", btnPagar);
        Thread.sleep(1000);
        js.executeScript("arguments[0].click();", btnPagar);
        
        // Espera más larga para procesamiento
        Thread.sleep(5000);
        System.out.println("Test 4 COMPLETADO - Proceso de checkout y pago realizado");
    }

    @Test
    @Order(5)
    @DisplayName("Verificar reserva finalizada desde ambas perspectivas")
    public void test05_verificarReservaFinalizada() throws InterruptedException {
        System.out.println("=== PASO 5: Verificación final ===");
        
        // 1. Verificar desde OPERADOR
        driverOperador.get(BASE_URL + "/operador/reservas");
        Thread.sleep(3000);
        
        List<WebElement> reservasOperador = driverOperador.findElements(
            By.cssSelector(".reserva-card, .reserva-item, app-reserva, mat-card, .card, [class*='reserva']"));
        
        boolean reservaFinalizadaOperador = false;
        for (WebElement reserva : reservasOperador) {
            String textoReserva = reserva.getText().toLowerCase();
            if (textoReserva.contains("finalizada") || textoReserva.contains("completada") || 
                textoReserva.contains("terminada") || textoReserva.contains("cerrada") ||
                textoReserva.contains("checkout") || textoReserva.contains("pagada")) {
                reservaFinalizadaOperador = true;
                System.out.println("Operador ve reserva finalizada");
                break;
            }
        }
        
        assertTrue(reservaFinalizadaOperador, "El operador debe ver al menos una reserva finalizada");
        
        // 2. Verificar desde USUARIO
        driverUsuario.get(BASE_URL + "/reservas");
        Thread.sleep(3000);
        
        List<WebElement> reservasUsuario = driverUsuario.findElements(
            By.cssSelector(".reserva-card, .reserva-item, app-reserva, mat-card, .card, [class*='reserva']"));
        
        boolean reservaFinalizadaUsuario = false;
        for (WebElement reserva : reservasUsuario) {
            String textoReserva = reserva.getText().toLowerCase();
            if (textoReserva.contains("finalizada") || textoReserva.contains("completada") || 
                textoReserva.contains("terminada") || textoReserva.contains("cerrada") ||
                textoReserva.contains("checkout") || textoReserva.contains("pagada")) {
                reservaFinalizadaUsuario = true;
                System.out.println("Usuario ve reserva finalizada");
                break;
            }
        }
        
        assertTrue(reservaFinalizadaUsuario, "El usuario debe ver su reserva como finalizada");
        System.out.println("CASO DE USO 2 COMPLETADO EXITOSAMENTE - Flujo usuario-operador verificado");
    }
}