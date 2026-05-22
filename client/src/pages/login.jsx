import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect para verificar si ya hay una sesión activa (opcional)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verificar si el token es válido (opcional)
      // Podrías redirigir al usuario a la página principal
      // navigate("/productos");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!email || !password) {
      setError("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Llamada al endpoint de autenticación
      // NOTA: Según tu controller, necesitas un endpoint /api/auth/login
      // Ya que tu controller de usuarios no tiene endpoint de login
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: email,      // El campo en tu backend es "mail"
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token en localStorage o sessionStorage
      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      // Guardar datos del usuario (opcional)
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login exitoso:", data);
      
      // Redirigir a la página de productos
      navigate("/productos");

    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 style={styles.heading}>Bienvenido</h1>
        <p style={styles.subtitle}>Ingresá a tu cuenta para continuar</p>

        {/* Mostrar error si existe */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label} htmlFor="email">Correo electrónico</label>
          <div style={styles.inputWrap}>
            <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label} htmlFor="password">Contraseña</label>
          <div style={styles.inputWrap}>
            <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: "40px" }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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

        {/* Remember + Forgot */}
        <div style={styles.row}>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#000" }}
              disabled={loading}
            />
            Recordarme
          </label>
          <Link to="/login" style={styles.forgot}>¿Olvidaste tu contraseña?</Link>
        </div>

        {/* Submit */}
        <button onClick={handleLogin} style={styles.btnPrimary} disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={styles.footerLink}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f3",
    padding: "2rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e5e3",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "380px",
  },
  logo: {
    width: "36px",
    height: "36px",
    backgroundColor: "#111",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#111",
    margin: "0 0 0.3rem",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 2rem",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  field: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#666",
    marginBottom: "6px",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "10px",
    color: "#aaa",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    height: "38px",
    padding: "0 12px 0 34px",
    fontSize: "14px",
    border: "1px solid #e5e5e3",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#111",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    color: "#aaa",
    display: "flex",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#666",
    cursor: "pointer",
  },
  forgot: {
    fontSize: "13px",
    color: "#666",
    textDecoration: "none",
  },
  btnPrimary: {
    width: "100%",
    height: "38px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: "1.5rem",
    transition: "opacity 0.2s",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  footerLink: {
    color: "#111",
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
  },
};