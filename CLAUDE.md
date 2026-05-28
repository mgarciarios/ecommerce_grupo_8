# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce application. Backend is a Spring Boot REST API with JWT auth. Frontend is a React SPA.

## Commands

### Backend (server/)

```bash
# Run the server (requires MySQL running on localhost:3306)
cd server && ./mvnw spring-boot:run        # Server starts on port 8080

# Run tests
cd server && ./mvnw test                    # Run all tests
cd server && ./mvnw test -Dtest=ProductoServiceTest  # Run a single test class

# Package as JAR
cd server && ./mvnw clean package
```

### Frontend (client/)

```bash
cd client && npm run dev      # Start dev server (defaults to port 5173)
cd client && npm run build    # Production build
cd client && npm run lint     # ESLint
cd client && npm run preview  # Preview production build
```

### Full-stack development

Start both servers concurrently (MySQL must be running):
```bash
cd server && ./mvnw spring-boot:run &
cd client && npm run dev
```

The backend CORS config allows `http://localhost:5173`. The frontend `productService.js` points to `http://localhost:8080/api`.

## Architecture

### Backend (Spring Boot — Java 17, Maven, Spring Boot 4.0.4)

Standard layered architecture under `com.uade.tpo.e_commerce3`:

- **`config/`** — `SecurityConfig.java`: Spring Security setup. Stateless sessions, JWT filter, BCrypt password encoding. CORS configured for localhost:5173. Defines route-based access control (see Auth section below).
- **`controller/`** — REST controllers. `ProductoController` (CRUD + stock partial update at `/api/productos`), `AuthenticationController` (`/api/auth` — register/login), `CarritoController` (`/api/carrito` — cart management), `UsuariosController` (admin user management).
- **`service/`** — Business logic. `AuthenticationService` (register with mail uniqueness check, password hashing; login via `AuthenticationManager` + JWT generation), `ProductoService`, `CarritoService`, `ProductoCarritoService`, `UsuarioService`.
- **`repository/`** — Spring Data JPA repositories.
- **`model/`** — JPA entities: `Usuario` (implements `UserDetails`, mail = username, `Role` enum: USER/ADMIN/VENDEDOR), `Producto`, `Categoria` (M:N with Producto via join table `productos_categorias`), `Carrito` (belongs to a user via `usuarioId`), `ProductoCarrito` (join entity between Carrito and Producto with `cantidad_producto`).
- **`security/`** — `JwtFilter` (OncePerRequestFilter, extracts Bearer token from Authorization header, validates with `JwtUtil`, sets `SecurityContext`), `JwtUtil` (jjwt 0.11.5, HS256 signing, token contains username + roles, expiration from `jwt.expiration` property).
- **`dto/`** — Request/response DTOs.
- **`exception/`** — Custom exceptions + `GlobalExceptionHandler` (`@ControllerAdvice`).

**Database**: MySQL (`ecommerce_db3`) with Hibernate `ddl-auto=update`. H2 is available (commented out in `application.properties`) for dev without MySQL.

### Auth flow

1. `POST /api/auth/register` or `POST /api/auth/login` — public endpoints
2. Login returns JWT in `AuthResponse.token`
3. Client stores token in `localStorage` and sends it as `Authorization: Bearer <token>` on subsequent requests
4. `JwtFilter` validates on every request and sets `SecurityContext` with roles
5. **Route permissions** (defined in `SecurityConfig`):
   - `GET /api/productos/**` — public
   - `POST|PUT|DELETE /api/productos/**` — ADMIN only
   - `/api/carrito/**` — authenticated
   - `/api/admin/**`, `/api/usuarios/**` — ADMIN only

### Frontend (React 19 + Vite 8 + React Router 7)

- **`src/main.jsx`** — Entry point, renders `<App />` into `#root`
- **`src/App.jsx`** — BrowserRouter with routes: `/productos`, `/producto/:id`, `/login`, `/register`, `/profile`, `/AdminPanel`. Fallback redirects to `/productos`. NavBar hidden on login/register pages.
- **`src/pages/`** — Page components: `listadoProductos`, `ProductoDetalle`, `login`, `registro`, `perfil`, `AdminPanel`
- **`src/components/`** — Reusable components: `Card`, `NavBar`, `ProductForm`, `ProductsTable`
- **`src/hooks/`** — `useProducts.js`: custom hook managing products state (CRUD operations, categories, loading/error). Wraps `productService`.
- **`src/services/productService.js`** — Fetch wrapper for `/api/productos`. Attaches JWT from `localStorage` for write operations.
- **`src/css/`** — Plain CSS files, one per page/component.

**Auth on frontend**: Token stored in `localStorage` (or `sessionStorage` if "remember me" unchecked). No centralized auth context — each page/service reads token directly.

## Key files

| File | Purpose |
|------|---------|
| `server/src/main/resources/application.properties` | DB connection, JWT secret/expiration, server port |
| `server/src/main/java/.../config/SecurityConfig.java` | All security rules and CORS |
| `server/src/main/java/.../security/JwtUtil.java` | JWT generation/validation |
| `client/src/App.jsx` | All routes |
| `client/src/services/productService.js` | API client (base URL, auth headers) |
