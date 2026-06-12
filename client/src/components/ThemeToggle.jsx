import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice'; 
import './css/ThemeToggle.css'; // <-- Importamos su CSS correspondiente

export default function ThemeToggle() {
  const dispatch = useDispatch();
  
  // Traemos el modo actual ('light' o 'dark') desde Redux
  const currentMode = useSelector((state) => state.theme.mode);

  return (
    <button 
      onClick={() => dispatch(toggleTheme())} 
      className="theme-toggle-btn"
    >
      {currentMode === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  );
}