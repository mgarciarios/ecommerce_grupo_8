import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { nombre, apellido, username, email, password } = form;
    if (!nombre || !apellido || !username || !email || !password) {
      alert("Por favor completá todos los campos.");
      return;
    }
    console.log("Registro:", form);
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

        <h1 style={styles.heading}>Crear cuenta</h1>
        <p style={styles.subtitle}>Completá tus datos para registrarte</p>

        {/* Nombre + Apellido */}
        <div style={styles.row}>
          <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label} htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Juan"
              autoComplete="given-name"
              value={form.nombre}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label} htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Pérez"
              autoComplete="family-name"
              value={form.apellido}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        {/* Username */}
        <div style={styles.field}>
          <label style={styles.label} htmlFor="username">Nombre de usuario</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputPrefix}>@</span>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="juanperez"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              style={{ ...styles.input, paddingLeft: "28px" }}
            />
          </div>
        </div>

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
              name="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
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
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, paddingRight: "40px" }}
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

        {/* Submit */}
        <button onClick={handleRegister} style={styles.btnPrimary}>
          Crear cuenta
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          ¿Ya tenés cuenta?{" "}
          <a href="#" style={styles.footerLink}>Iniciá sesión</a>
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
    maxWidth: "420px",
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
  row: {
    display: "flex",
    gap: "12px",
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
  inputPrefix: {
    position: "absolute",
    left: "10px",
    fontSize: "14px",
    color: "#aaa",
    pointerEvents: "none",
    userSelect: "none",
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
  },
};