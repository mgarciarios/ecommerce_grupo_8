import { useState } from "react";

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
    <div style={styles.field}>
      <label style={styles.label} htmlFor={id}>{label}</label>
      <div style={styles.inputWrap}>
        {icon && <span style={styles.inputIcon}>{icon}</span>}
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
        style={{ ...styles.input, paddingRight: "40px" }}
      />
      <button type="button" onClick={() => setShow(!show)} style={styles.eyeBtn} aria-label="Mostrar/ocultar contraseña">
        {show ? <IconEyeOff /> : <IconEye />}
      </button>
    </Field>
  );
}

function Toast({ message, onClose }) {
  return (
    <div style={styles.toast}>
      <span style={styles.toastIcon}><IconCheck /></span>
      {message}
    </div>
  );
}

export default function Profile() {
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

  const handleInfoSave = () => {
    if (!info.nombre || !info.apellido || !info.username || !info.email) {
      alert("Por favor completá todos los campos.");
      return;
    }
    showToast("Datos actualizados correctamente");
  };

  const handlePwdSave = () => {
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
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        {/* Avatar */}
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <p style={styles.avatarName}>{info.nombre} {info.apellido}</p>
            <p style={styles.avatarUsername}>@{info.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "info" ? styles.tabActive : {}) }}
            onClick={() => setTab("info")}
          >
            Información personal
          </button>
          <button
            style={{ ...styles.tab, ...(tab === "pwd" ? styles.tabActive : {}) }}
            onClick={() => setTab("pwd")}
          >
            Contraseña
          </button>
        </div>

        {/* Tab: Info */}
        {tab === "info" && (
          <div>
            <div style={styles.row}>
              <Field label="Nombre" id="nombre" icon={<IconUser />}>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Juan"
                  value={info.nombre}
                  onChange={(e) => setInfo({ ...info, nombre: e.target.value })}
                  style={styles.input}
                />
              </Field>
              <Field label="Apellido" id="apellido" icon={<IconUser />}>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Pérez"
                  value={info.apellido}
                  onChange={(e) => setInfo({ ...info, apellido: e.target.value })}
                  style={styles.input}
                />
              </Field>
            </div>

            <Field label="Nombre de usuario" id="username">
              <span style={styles.prefixAt}>@</span>
              <input
                id="username"
                type="text"
                placeholder="juanperez"
                value={info.username}
                onChange={(e) => setInfo({ ...info, username: e.target.value })}
                style={styles.input}
              />
            </Field>

            <Field label="Correo electrónico" id="email" icon={<IconMail />}>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                style={styles.input}
              />
            </Field>

            <button onClick={handleInfoSave} style={styles.btnPrimary}>
              Guardar cambios
            </button>
          </div>
        )}

        {/* Tab: Password */}
        {tab === "pwd" && (
          <div>
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
            <button onClick={handlePwdSave} style={styles.btnPrimary}>
              Actualizar contraseña
            </button>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} />}
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
    maxWidth: "440px",
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
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "1.75rem",
    paddingBottom: "1.75rem",
    borderBottom: "1px solid #e5e5e3",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 500,
    flexShrink: 0,
  },
  avatarName: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#111",
    margin: "0 0 2px",
  },
  avatarUsername: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: "4px",
    marginBottom: "1.75rem",
    backgroundColor: "#f5f5f3",
    borderRadius: "10px",
    padding: "4px",
  },
  tab: {
    flex: 1,
    height: "34px",
    border: "none",
    borderRadius: "7px",
    fontSize: "13px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#888",
    fontWeight: 400,
    transition: "all 0.15s",
  },
  tabActive: {
    backgroundColor: "#fff",
    color: "#111",
    fontWeight: 500,
    border: "1px solid #e5e5e3",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  field: {
    marginBottom: "1.25rem",
    flex: 1,
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
    display: "flex",
  },
  prefixAt: {
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
    marginTop: "0.25rem",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "13px",
    padding: "10px 18px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap",
  },
  toastIcon: {
    display: "flex",
    alignItems: "center",
    opacity: 0.8,
  },
};