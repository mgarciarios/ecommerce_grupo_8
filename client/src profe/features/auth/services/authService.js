// No necesitamos una URL de API para esta simulación.

export const authService = {
  /**
   * Simula una función de login.
   * @param {object} credentials - Objeto con email y password.
   * @returns {Promise<object>} - Promesa que resuelve con el usuario y un token falso si es exitoso.
   * @throws {Error} - Lanza un error si las credenciales son incorrectas.
   */
  login: async (credentials) => {
    console.log('Simulando login con:', credentials);

    // Simulamos una pequeña demora de red para que parezca más real.
    await new Promise(resolve => setTimeout(resolve, 500));

    // --- Lógica de la simulación ---
    // Comprobamos las credenciales contra valores fijos.
    // Usuario: user@example.com
    // Contraseña: password
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      // Si las credenciales son correctas, devolvemos un usuario y un token falsos.
      const fakeUser = {
        id: 1,
        nombre: 'Usuario de Prueba',
        email: 'user@example.com',
      };
      const fakeToken = 'fake-jwt-token-for-simulation-12345';
      
      console.log('Login simulado ¡exitoso!');
      return { user: fakeUser, token: fakeToken };
    } else {
      // Si las credenciales son incorrectas, lanzamos un error, como haría un servidor real.
      console.log('Login simulado ¡fallido!');
      throw new Error('Usuario o contraseña incorrectos.');
    }
  },

  /**
   * Simula la obtención del usuario actual a partir de un token.
   */
  getCurrentUser: async (token) => {
    // Para esta simulación, si el token es el que generamos, devolvemos el usuario.
    if (token === 'fake-jwt-token-for-simulation-12345') {
      return {
        id: 1,
        nombre: 'Usuario de Prueba',
        email: 'user@example.com',
      };
    }
    // Si el token no es válido (o no hay), no devolveemos nada.
    return null;
  }
};