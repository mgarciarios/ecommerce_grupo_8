// NUEVO: Modificamos cómo verificamos la existencia de sesión.
// Ahora nos basamos en si existe el objeto 'user' en el storage.
const getStoredUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// NUEVO: Eliminamos decodeJwtPayload() ya que no podemos leer el JWT

export const isAuthenticated = () => Boolean(getStoredUser());

export const isAdminUser = () => {
  // NUEVO: En lugar de decodificar el token, buscamos el rol en el usuario guardado
  const user = getStoredUser();
  if (!user) return false;

  // Adaptamos la lógica para leer los roles desde el objeto user
  // Asegúrate de que el backend envíe la propiedad 'role' o 'roles' dentro de los datos del usuario al loguearse.
  const roles = String(user.roles || user.role || '')
    .split(',')
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean);

  return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
};

// NUEVO: Exportar un método obsoleto que retorne null para no romper componentes 
// que aún intenten llamar a getToken() mientras migramos.
export const getToken = () => null;