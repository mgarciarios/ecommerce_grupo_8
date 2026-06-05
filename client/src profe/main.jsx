import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import { store } from './store/index.js'
// import CartPage from './hooks/useContext/CartPage.jsx';
import Card from './ejemplos/Card.jsx';
import OnOff from './ejemplos/OnOff.jsx';
import UseStateExample from './hooks/UseStateExample.jsx';
import FollowButton from './hooks/FollowButton.jsx';
import ProductFilter from './hooks/ProductFilter.jsx';
import UseEffectExample from './hooks/UseEffectExample.jsx';
import CartPage from './hooks/useContext/CartPage.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
