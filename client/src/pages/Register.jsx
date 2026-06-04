import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/Register.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const { nombre, apellido, nombreUsuario, email, password } = form;
    
    // Validaciones
    if (!nombre || !apellido || !nombreUsuario || !email || !password) {
      setError("Por favor completá todos los campos.");
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresá un email válido.");
      return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Preparar el body que se enviará
      const requestBody = {
        nombre: form.nombre,
        apellido: form.apellido,
        nombreUsuario: form.nombreUsuario,
        mail: form.email,
        password: form.password,
      };

      console.log("📤 Enviando solicitud a:", "http://localhost:8080/api/auth/register");
      console.log("📦 Body enviado:", JSON.stringify(requestBody, null, 2));

      // Llamada al endpoint de registro
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Status HTTP:", response.status);
      console.log("📡 Status Text:", response.statusText);
      console.log("📡 Headers:", Object.fromEntries(response.headers.entries()));

      // Intentar obtener la respuesta como texto primero para mejor debugging
      const responseText = await response.text();
      console.log("📄 Respuesta cruda (texto):", responseText);

      let data = null;
      try {
        // Intentar parsear como JSON
        data = JSON.parse(responseText);
        console.log("📄 Respuesta parseada (JSON):", data);
      } catch (parseError) {
        console.error("❌ Error al parsear JSON:", parseError);
        data = { message: responseText || "No se pudo parsear la respuesta" };
      }

      if (!response.ok) {
        // Mostrar error detallado
        console.error("❌ Error HTTP:", response.status);
        console.error("❌ Detalle del error:", data);
        
        // Construir mensaje de error detallado
        let errorMessage = `Error ${response.status}: `;
        
        if (response.status === 404) {
          errorMessage += "El endpoint /api/auth/register no existe. Verifica la URL.";
        } else if (response.status === 409) {
          errorMessage += data.message || "El email o nombre de usuario ya está registrado";
        } else if (response.status === 400) {
          errorMessage += data.message || "Datos inválidos";
        } else if (response.status === 500) {
          errorMessage += data.message || "Error interno del servidor. Revisa los logs del backend.";
        } else {
          errorMessage += data.message || data.error || "Error al registrar usuario";
        }
        
        throw new Error(errorMessage);
      }

      console.log("✅ Registro exitoso:", data);
      
      // Mostrar mensaje de éxito
      alert("Registro exitoso. Ahora podés iniciar sesión.");
      
      // Redirigir al login
      navigate("/login");

    } catch (err) {
      console.error("🚨 ERROR CAPTURADO:", err);
      console.error("🚨 Nombre del error:", err.name);
      console.error("🚨 Mensaje del error:", err.message);
      console.error("🚨 Stack trace:", err.stack);
      
      // Mostrar error detallado en la interfaz
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrap">
        {/* Back link */}
        <Link to="/productos" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "13px", color: "#888", textDecoration: "none" }}>
          ← Volver al inicio
        </Link>
        
      <div className="register-card">

        {/* Logo */}
        <div className="register-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 className="register-heading">Crear cuenta</h1>
        <p className="register-subtitle">Completá tus datos para registrarte</p>

        {/* Mostrar mensaje de error detallado */}
        {error && (
          <div className="register-error" style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px", wordBreak: "break-word" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Nombre + Apellido */}
          <div className="register-row">
            <div className="register-field register-field-flex">
              <label className="register-label" htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan"
                autoComplete="given-name"
                value={form.nombre}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
            </div>
            <div className="register-field register-field-flex">
              <label className="register-label" htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Pérez"
                autoComplete="family-name"
                value={form.apellido}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* nombreUsuario */}
          <div className="register-field">
            <label className="register-label" htmlFor="nombreUsuario">Nombre de usuario</label>
            <div className="register-input-wrap">
              <span className="register-input-prefix">@</span>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                placeholder="juanperez"
                autoComplete="nombreUsuario"
                value={form.nombreUsuario}
                onChange={handleChange}
                className="register-input register-input-nombreUsuario"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="register-field">
            <label className="register-label" htmlFor="email">Correo electrónico</label>
            <div className="register-input-wrap">
              <svg className="register-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="register-field">
            <label className="register-label" htmlFor="password">Contraseña</label>
            <div className="register-input-wrap">
              <svg className="register-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="register-input register-input-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="register-eye-btn"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="register-btn-primary" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Footer */}
        <p className="register-footer">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}