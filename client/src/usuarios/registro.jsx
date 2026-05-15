import { useState } from "react";
import "../css/registro.css";; // <-- Importación de los estilos separados

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
    <div className="register-wrap">
      <div className="register-card">
        {/* Logo */}
        <div className="register-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 className="register-heading">Crear cuenta</h1>
        <p className="register-subtitle">Completá tus datos para registrarte</p>

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
              />
            </div>
          </div>

          {/* Username */}
          <div className="register-field">
            <label className="register-label" htmlFor="username">Nombre de usuario</label>
            <div className="register-input-wrap">
              <span className="register-input-prefix">@</span>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="juanperez"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                className="register-input register-input-username"
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="register-eye-btn"
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
          <button type="submit" className="register-btn-primary">
            Crear cuenta
          </button>
        </form>

        {/* Footer */}
        <p className="register-footer">
          ¿Ya tenés cuenta?{" "}
          <a href="#" className="register-footer-link">Iniciá sesión</a>
        </p>
      </div>
    </div>
  );
}