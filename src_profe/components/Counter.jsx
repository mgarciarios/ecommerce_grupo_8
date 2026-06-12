// Importa hooks de Redux para acceder al estado y despachar acciones
import { useDispatch, useSelector } from 'react-redux';
// Importa las acciones del slice del contador
import { increment, decrement, reset, incrementByAmount } from '../store/slices/counterSlice';


export default function Counter() {
  // state es el store global de Redux completo.
  // state.counter Obtiene el valor actual del contador del estado global
  
  // se suscribe a cambios en state.counter.value, cada vez que se modifica el valor del contador,
  //  el componente Counter se re renderiza 
  const count = useSelector((state) => state.counter.value);

  // Hook para despachar (ejecutar) acciones
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Contador con Redux: {count}</h1>
      <div style={{ marginTop: '20px' }}>
        {/* Botón que suma 1 */}
        <button onClick={() => dispatch(increment())} style={{ margin: '5px', padding: '10px' }}>
          +
        </button>
        {/* Botón que resta 1 */}
        <button onClick={() => dispatch(decrement())} style={{ margin: '5px', padding: '10px' }}>
          -
        </button>
        {/* Botón que suma 5 */}
        <button onClick={() => dispatch(incrementByAmount(5))} style={{ margin: '5px', padding: '10px' }}>
          +5
        </button>
        {/* Botón que reinicia el contador a 0 */}
        <button onClick={() => dispatch(reset())} style={{ margin: '5px', padding: '10px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
