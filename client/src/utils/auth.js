export const isAuthenticated = (user) => Boolean(user);

export const isAdminUser = (user) => {
  const roles = String(user?.roles || user?.role || user?.rol || '')
    .split(',')
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean);

  return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
};

export const getToken = () => null;
