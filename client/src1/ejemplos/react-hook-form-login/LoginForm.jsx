import React from 'react';
import { useForm } from 'react-hook-form';
import './LoginForm.css';

// --- Explicación: Componentes Controlados vs. No Controlados ---
// React tradicionalmente usa "componentes controlados", donde el estado de React
// es la única fuente de verdad para los inputs del formulario. Cada cambio en un
// input actualiza el estado con useState.
//
// React Hook Form, por defecto, usa "componentes no controlados". Esto significa
// que el DOM maneja el estado del input directamente (como en HTML normal). React Hook Form
// lee el valor solo cuando es necesario (al validar o enviar). Esto mejora el rendimiento
// al evitar re-renders en cada pulsación de tecla.

const LoginForm = () => {
  // --- Explicación: React Hook Form ---
  // `useForm` es el hook principal de la librería. Nos proporciona métodos y estado
  // para manejar el formulario de manera eficiente.
  const {
    register, // `register` nos permite "registrar" un input en React Hook Form.
              // Lo vincula para validación y seguimiento de su valor.
    handleSubmit, // `handleSubmit` es una función que envuelve nuestro propio manejador de envío.
                  // Se encarga de ejecutar primero la validación del formulario.
                  // Si la validación es exitosa, llama a nuestra función `onSubmit` con los datos del formulario.
    formState: { errors }, // `formState` contiene información sobre el estado del formulario.
                         // `errors` es un objeto que contendrá los errores de validación de cada campo.
  } = useForm();

  // Esta función se ejecutará solo si el formulario es válido.
  const onSubmit = (data) => {
    console.log('Datos del formulario enviados:', data);
    // Aquí iría la lógica para enviar los datos a un servidor.
    alert(`Login exitoso para el usuario: ${data.email}`);
  };

  return (
    <div className="form-container">
      <h2>Login con React Hook Form</h2>
      {/* `handleSubmit` previene el comportamiento por defecto del formulario y ejecuta la validación */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            // --- Explicación: Validación de Datos ---
            // El hook `register` recibe un segundo argumento con las reglas de validación.
            {...register('email', {
              required: 'El email es obligatorio', // Regla: el campo no puede estar vacío.
              pattern: { // Regla: el valor debe coincidir con una expresión regular.
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'El formato del email no es válido', // Mensaje de error si el patrón no coincide.
              },
            })}
          />
          {/* --- Explicación: Manejo de Errores y Feedback ---
              // El objeto `errors` contiene una entrada por cada campo que no pasó la validación.
              // Aquí comprobamos si existe `errors.email`. Si es así, mostramos el mensaje de error
              // que definimos en las reglas de validación. Esto da feedback inmediato al usuario. */}
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6, // Regla: la contraseña debe tener al menos 6 caracteres.
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="submit-button">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;
