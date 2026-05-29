import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Field({ label, id, icon, children }) {
  return (
    <div className="profile-field">
      <label className="profile-label" htmlFor={id}>{label}</label>
      <div className="profile-input-wrap">
        {icon && <span className="profile-input-icon">{icon}</span>}
        {children}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} id={id} icon={<IconLock />}>
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: "40px" }} /* Mantenemos este padding inline por compatibilidad del botón interno */
        className="profile-input"
      />
      <button type="button" onClick={() => setShow(!show)} className="profile-eye-btn" aria-label="Mostrar/ocultar contraseña">
        {show ? <IconEyeOff /> : <IconEye />}
      </button>
    </Field>
  );
}

function Toast({ message }) {
  return (
    <div className="profile-toast">
      <span className="profile-toast-icon"><IconCheck /></span>
      {message}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const [toast, setToast] = useState(null);

  const [info, setInfo] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    username: "juanperez",
    email: "juan@email.com",
  });

  const [pwd, setPwd] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleInfoSave = (e) => {
    e.preventDefault();
    if (!info.nombre || !info.apellido || !info.username || !info.email) {
      alert("Por favor completá todos los campos.");
      return;
    }
    showToast("Datos actualizados correctamente");
  };

  const handlePwdSave = (e) => {
    e.preventDefault();
    if (!pwd.actual || !pwd.nueva || !pwd.confirmar) {
      alert("Por favor completá todos los campos.");
      return;
    }
    if (pwd.nueva !== pwd.confirmar) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }
    setPwd({ actual: "", nueva: "", confirmar: "" });
    showToast("Contraseña actualizada correctamente");
  };

  const initials = `${info.nombre[0] || ""}${info.apellido[0] || ""}`.toUpperCase();

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        {/* Logo */}
        <button className="profile-logo" onClick={() => navigate('/favorites')} title="Mis favoritos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="profile-avatar-row">
          <div className="profile-avatar">{initials}</div>
          <div>
            <p className="profile-avatar-name">{info.nombre} {info.apellido}</p>
            <p className="profile-avatar-username">@{info.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${tab === "info" ? "profile-tab-active" : ""}`}
            onClick={() => setTab("info")}
          >
            Información personal
          </button>
          <button
            className={`profile-tab ${tab === "pwd" ? "profile-tab-active" : ""}`}
            onClick={() => setTab("pwd")}
          >
            Contraseña
          </button>
        </div>

        {/* Tab: Info */}
        {tab === "info" && (
          <form onSubmit={handleInfoSave}>
            <div className="profile-row">
              <Field label="Nombre" id="nombre" icon={<IconUser />}>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Juan"
                  value={info.nombre}
                  onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
                  className="profile-input"
                />
              </Field>
              <Field label="Apellido" id="apellido" icon={<IconUser />}>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Pérez"
                  value={info.apellido}
                  onChange={(e) => setInfo({ ...info, apellido: e.target.value })}
                  className="profile-input"
                />
              </Field>
            </div>

            <Field label="Nombre de usuario" id="username">
              <span className="profile-prefix-at">@</span>
              <input
                id="username"
                type="text"
                placeholder="juanperez"
                value={info.username}
                onChange={(e) => setInfo({ ...info, username: e.target.value })}
                className="profile-input"
                style={{ paddingLeft: "28px" }}
              />
            </Field>

            <Field label="Correo electrónico" id="email" icon={<IconMail />}>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                className="profile-input"
              />
            </Field>

            <button type="submit" className="profile-btn-primary">
              Guardar cambios
            </button>
          </form>
        )}

        {/* Tab: Password */}
        {tab === "pwd" && (
          <form onSubmit={handlePwdSave}>
            <PasswordField
              id="actual"
              label="Contraseña actual"
              placeholder="••••••••"
              value={pwd.actual}
              onChange={(e) => setPwd({ ...pwd, actual: e.target.value })}
            />
            <PasswordField
              id="nueva"
              label="Nueva contraseña"
              placeholder="••••••••"
              value={pwd.nueva}
              onChange={(e) => setPwd({ ...pwd, nueva: e.target.value })}
            />
            <PasswordField
              id="confirmar"
              label="Confirmar nueva contraseña"
              placeholder="••••••••"
              value={pwd.confirmar}
              onChange={(e) => setPwd({ ...pwd, confirmar: e.target.value })}
            />
            <button type="submit" className="profile-btn-primary">
              Actualizar contraseña
            </button>
          </form>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}