// src/components/DebugAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';

export const DebugAuth = () => {
  const { token, isAuthenticated } = useSelector(state => state.auth);

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#222',
      color: '#0f0',
      padding: '1rem',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace',
      border: '1px solid #0f0',
      zIndex: 9999
    }}>
      <div><strong>Redux State (Auth):</strong></div>
      <div>token: {token ? `${token.slice(0, 20)}...` : 'null'}</div>
      <div>isAuthenticated: {isAuthenticated ? '✅ true' : '❌ false'}</div>
      <div style={{ marginTop: '0.5rem', fontSize: '10px' }}>
        Presiona F5 para recarga y ve cómo se borran
      </div>
    </div>
  );
};