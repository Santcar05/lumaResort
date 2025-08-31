# Hotel Luma Resort

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?lines=Desarrollo%20Web;Hotel%20Luma%20Resort;http;CSS;JavaScript;JPA%20UI&center=true&width=600&height=45">
</p>

## 📌 Descripción del Proyecto

**HotelLumaResort** es una aplicación desarrollada en Java 21 con Spring Boot, que tiene como propósito la gestión de un resort/hotel de manera integral. El sistema permite administrar información clave como reservas, clientes, servicios adicionales, empleados y operaciones internas, todo en un solo lugar.

La app permite la interacción entre **dos tipos de usuarios**:

---

## ✨ Características principales

### 👤 Usuario
- Registro e inicio de sesión.
- Consulta de habitaciones disponibles.
- Realización de reservas en línea.
- Consulta de sus reservas activas.
- Cancelación de reservas.

### 🛠️ Administrador
- Gestión de clientes.
- Gestión de habitaciones (crear, actualizar, eliminar).
- Control de reservas realizadas por los clientes.
- Visualización de reportes básicos de uso del resort.

---

##  ✨ Características principales
📋 Gestión de entidades: clientes, habitaciones, empleados y servicios.
🗄️ Persistencia de datos con H2 en archivo.
🔍 Consultas dinámicas gracias a Spring Data JPA.
🎯 Arquitectura organizada en capas: controladores, servicios, repositorios y entidades.
⚡ API REST para interacción con el sistema y fácil integración futura.


## 🎯 Objetivo del proyecto
Este proyecto busca sentar las bases para un sistema de información que pueda crecer hacia un producto completo de gestión hotelera, escalable y adaptable a las necesidades de un resort moderno.

---

## 👥 Integrantes

| Foto | Nombre | Mini biografía |
|------|--------|----------------|
| ![Foto Daniel](https://github.com/Santcar05/lumaResort/blob/main/IMG/Daniel%20Bohorquez-Gerente.png) | **Daniel Felipe Bohorquez Casas** | *(biografía breve)* |
| ![Foto Santiago](https://github.com/Santcar05/lumaResort/blob/main/IMG/Santiago%20Castro-gerente.png) | **Santiago Castro Garzón** | *(biografía breve)* |
| ![Foto Juan Esteban](https://github.com/Santcar05/lumaResort/blob/main/IMG/Juanes%20D%C3%ADaz-Gerente.jpeg)) | **Juan Esteban Díaz Toledo** | "Despierto todas las mañanas y aunque no sepa lo que tengo que hacer, pongo un pie delante del otro y trato de tomar las mejores decisiones que puedo. Me equivoco muchas veces, pero de eso se trata ser un humano... Y esa es mi mayor fortaleza" |
| ![Foto Parrales](https://github.com/PUJ-ICM-4013/Looksoon/blob/main/WhatsApp%20Image%202025-08-13%20at%202.26.17%20PM.jpeg) | **Juan Felipe Parrales Lara** | *(biografía breve)* |



---

## 📂 Entregables

- 📑 **Presentación de la propuesta** → [Ver archivo](https://www.canva.com/design/DAGvNkdwLYE/x1Woo2c7gvDfT9hvAdyRug/edit?utm_content=DAGvNkdwLYE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- 🎭 **Diagrama de casos de uso / Historias de usuario** → [Ver archivo](https://github.com/PUJ-ICM-4013/Looksoon/blob/main/Diagrama%20de%20casos%20de%20uso.jpeg)  
- 🏗️ **Diagrama de clases inicial** → [Ver archivo](https://github.com/PUJ-ICM-4013/Looksoon/blob/main/Diagrama%20de%20clases.png)  

---

## 🛠️ Tecnologías utilizadas  
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)  
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)  
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-007396?style=for-the-badge&logo=hibernate&logoColor=white)  
![H2 Database](https://img.shields.io/badge/H2%20Database-004D80?style=for-the-badge&logo=h2&logoColor=white)  
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)  

---

## 📂 Estructura del proyecto

El proyecto sigue la estructura típica de un **Spring Boot**, organizada en paquetes:

- `controller/` → Controladores REST y de vistas.
- `entities/` → Entidades JPA que representan las tablas de la BD.
- `repository/` → Repositorios que gestionan la comunicación con la BD.
- `service/` → Lógica de negocio.
- `resources/` → Archivos de configuración (`application.properties`) y plantillas HTML.

---

## 🗄️ Base de datos

El proyecto usa **H2 Database** en modo archivo para que los datos sean **persistentes**.  
Al iniciar la aplicación, se crea el archivo en el directorio del proyecto:
/lumaResort/mydatabase.mv.db

La consola de administración de H2 está habilitada en:

👉 [http://localhost:8080/h2](http://localhost:8080/h2)  
Usuario por defecto: `sa`  
Contraseña: *(vacía)*

---

## 🚀 Ejecución del proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/lumaresort.git
2. Entrar al proyecto:
   cd lumaresort
3. Ejecutar con Maven:
   mvn spring-boot:run
4. Acceder a la aplicación:
   👉 http://localhost:8080
