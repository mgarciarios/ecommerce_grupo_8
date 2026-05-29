import React, { useState } from 'react';

// formulario validado, valida si la contraseña es vacío y tienen el formato correcto
function FormularioPago() {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Expresión regular para validar el formato de un email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);

    // Lógica de validación
    if (nuevoEmail.trim() === '') {
      setErrorEmail('El correo electrónico es obligatorio.');
      setIsFormValid(false);
    } else if (!emailRegex.test(nuevoEmail)) {
      setErrorEmail('Por favor, ingresa un correo electrónico válido.');
      setIsFormValid(false);
    } else {
      setErrorEmail('');
      setIsFormValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      alert(`Compra completada. Se enviará una confirmación a: ${email}`);
    } else {
      alert('Por favor, corrige los errores del formulario para continuar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Datos de Facturación</h2>
      <div>
        <label>
          Correo Electrónico:
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        {errorEmail && <p style={{ color: 'red' }}>{errorEmail}</p>}
      </div>
      <button type="submit" disabled={!isFormValid}>
        Comprar
      </button>
    </form>
  );
}

export default FormularioPago;