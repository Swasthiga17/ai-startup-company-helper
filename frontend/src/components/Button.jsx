import React from 'react';
import './Button.css';

export const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => (
  <button
    type={type}
    className={`btn-gradient ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
