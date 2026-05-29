import React from 'react';
import { useForm } from 'react-hook-form';

// Tipo de datos del formulario (opcional pero recomendado para TypeScript)
// type FormInputs = {
//   email: string;
// };

function FormularioPagoReactForm() {
  // 1. Inicializamos React Hook Form
  const { // Desestructuramos los métodos y objetos que nos provee el hook useForm.
    register, // 'register' es una función para registrar inputs en el formulario.
    handleSubmit, // 'handleSubmit' es una función que envuelve nuestro manejador de envío para gestionar la validación.
    formState: { errors } // 'formState' contiene el estado del formulario, y de él extraemos 'errors', un objeto con los errores de validación.
  } = useForm(); // Ejecutamos el hook useForm para obtener la instancia del formulario.

  // 2. Función que se ejecuta al enviar el formulario si la validación es exitosa
  const onSubmit = (data) => { // 'data' es un objeto que contiene los valores de los campos del formulario ya validados.
    alert(`Compra completada para el email: ${data.email}`); // Muestra una alerta de éxito con el email proporcionado.
    console.log(data); // Imprime en la consola el objeto con los datos del formulario.
  };

  return ( 
    <form onSubmit={handleSubmit(onSubmit)}> {/* Al enviar el formulario, se llama a handleSubmit, que a su vez llamará a nuestro 'onSubmit' si no hay errores. */}
      <h2>Datos de Contacto</h2> 
      <div> 
        <label>
          Correo Electrónico:
          <input // El campo de entrada para el email.
            type="email" // Define el tipo de input, ayudando a la validación del navegador.
            placeholder="ejemplo@correo.com" // Texto de ejemplo que se muestra cuando el campo está vacío.
            // 3. Registramos el input y sus reglas de validación
            {...register("email", { 
              required: "El email es obligatorio", 
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "El formato del email no es válido"
              } 
            })} 
            // Usamos el spread operator para pasar las props que 'register' necesita (onChange, onBlur, name, ref).
            // {
            //   name: "email", // El nombre que le pasaste
            //   onChange: (e) => { /* una función para manejar cambios */ },
            //   onBlur: (e) => { /* una función para manejar cuando sales del campo */ },
            //   ref: { /* una referencia interna que usa la librería */ }
            // }
            // El primer argumento "email" es el nombre del campo.
            // El segundo argumento es un objeto de configuración para las reglas de validación. 'required: true' significa que no puede estar vacío.
          />
        </label>
        {/* 4. Mostramos un mensaje de error si existe */}
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>} {/* Renderizado condicional: Si el objeto 'errors' tiene una propiedad 'email' (porque falló la validación), se renderiza este párrafo. */}
      </div>

      <button type="submit"> {/* Un botón de tipo 'submit' que dispara el evento onSubmit del formulario. */}
        Comprar
      </button>
    </form>
  );
}

export default FormularioPagoReactForm; // Exporta el componente para poder usarlo en otras partes de la aplicación.
