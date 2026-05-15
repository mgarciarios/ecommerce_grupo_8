import { useState } from "react";
import "../css/login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor completá todos los campos.");
      return;
    }
    console.log("Login:", { email, remember });
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 className="login-heading">Bienvenido</h1>
        <p className="login-subtitle">Ingresá a tu cuenta para continuar</p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="email">Correo electrónico</label>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
                className="login-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="password">Contraseña</label>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
                /* Combinamos la clase base con el padding extra para el ojo */
                className="login-input login-input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-eye-btn"
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
          <div className="login-row">
            <label className="login-check-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: "#000" }}
              />
              Recordarme
            </label>
            <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Submit */}
          <button type="submit" className="login-btn-primary">
            Iniciar sesión
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          ¿No tenés cuenta?{" "}
          <a href="#" className="login-footer-link">Registrate</a>
        </p>
      </div>
    </div>
  );
}