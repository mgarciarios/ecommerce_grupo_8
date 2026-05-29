import React, { useState } from 'react';

// componente controlados logitud contraseña
function FormularioValidado() {
  // 1. Estado para los datos del formulario
  const [datosRegistro, setDatosRegistro] = useState({
    nombreUsuario: '',
    contrasena: '',
  });

  // 2. Estado para el mensaje de error de validación
  const [errorContrasena, setErrorContrasena] = useState('');

  // 3. Manejador de cambios mejorado
  const handleInputChange = (e) => { // Define la función que se ejecuta cada vez que un input cambia. 'e' es el evento.
    const { name, value } = e.target; // Desestructura el nombre y el valor del input que originó el evento.
    
    // Actualizamos el estado del formulario
    setDatosRegistro({ // Llama a la función para actualizar el estado del formulario.
      ...datosRegistro, // Copia todas las propiedades actuales del estado para no perder datos.
      [name]: value, // Actualiza la propiedad específica que cambió (ej: 'nombreUsuario' o 'contrasena').
    });
    
    // 4. Lógica de control: Validamos la contraseña en tiempo real
    if (name === 'contrasena') { // Comprueba si el campo que cambió es el de la contraseña.
      if (value.length < 6) { // Si la longitud de la nueva contraseña es menor a 6 caracteres...
        // Si la contraseña es muy corta, establecemos el estado del error
        setErrorContrasena('La contraseña debe tener al menos 6 caracteres.'); // Actualiza el estado de error con un mensaje.
      } else { // Si la contraseña tiene 6 o más caracteres...
        // Si es válida, limpiamos el estado del error
        setErrorContrasena(''); // Limpia el estado de error estableciéndolo como una cadena vacía.
      }
    }
  };

  // 5. Manejador de envío
  const handleSubmit = (e) => { // Define la función que se ejecuta cuando se envía el formulario.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (que es recargar la página).
    // Podemos evitar el envío si hay un error
    if (errorContrasena) { // Comprueba si existe algún mensaje en el estado de error de la contraseña.
      alert('Por favor, corrige los errores del formulario.'); // Si hay un error, muestra una alerta al usuario.
      return; // Detiene la ejecución de la función para que el formulario no se envíe.
    }
    console.log('Datos enviados:', datosRegistro); // Si no hay errores, muestra los datos del formulario en la consola.
    alert('¡Registro exitoso!'); // Muestra una alerta de éxito.
  };

  return ( 
    <form onSubmit={handleSubmit}> 
      <div> 
        <label> 
          Nombre de Usuario:
          <input // Elemento de entrada de texto.
            type="text" // Especifica que es un campo de texto.
            name="nombreUsuario" // Nombre del campo, debe coincidir con la clave en el estado 'datosRegistro'.
            value={datosRegistro.nombreUsuario} // El valor del input está controlado por el estado.
            onChange={handleInputChange} // Llama a handleInputChange cada vez que el valor del input cambia.
          />
        </label>
      </div>
      <div> 
        <label>
          Contraseña:
          <input // Elemento de entrada de texto para la contraseña.
            type="password" // Especifica que es un campo de contraseña (oculta los caracteres).
            name="contrasena" // Nombre del campo, debe coincidir con la clave en el estado.
            value={datosRegistro.contrasena} // El valor del input está controlado por el estado.
            onChange={handleInputChange} // Llama a handleInputChange cada vez que el valor del input cambia.
          />
          {/* 6. Renderizado condicional: Mostramos el error si existe */}
          {errorContrasena && ( // Si 'errorContrasena' no es una cadena vacía (es "truthy")...
            <p style={{ color: 'red', fontSize: '12px' }}>{errorContrasena}</p> // ...entonces renderiza este párrafo con el mensaje de error.
          )}
        </label>
      </div>
      <button type="submit">Registrar</button> {/* Botón que, al ser presionado, dispara el evento 'submit' del formulario. */}
    </form>
  );
}

export default FormularioValidado; // Exporta el componente para que pueda ser importado y utilizado en otras partes de la aplicación.
