const getStoredToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);

    return JSON.parse(
      decodeURIComponent(
        decoded
          .split('')
          .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      )
    );
  } catch (error) {
    console.error('No se pudo decodificar el token JWT:', error);
    return null;
  }
};

export const isAuthenticated = () => Boolean(getStoredToken());

export const isAdminUser = () => {
  const token = getStoredToken();
  const payload = decodeJwtPayload(token);
  const roles = String(payload?.roles || payload?.role || '')
    .split(',')
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean);

  return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
};

export const getToken = () => getStoredToken();
