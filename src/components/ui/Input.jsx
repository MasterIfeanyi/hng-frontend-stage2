import React, { useState } from 'react';

const Input = ({ label, error, style = {}, type = 'text', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
    width: '100%',
    ...style
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    color: error ? '#EC5757' : 'var(--text)',
    marginBottom: '8px',
    transition: 'color 0.2s',
  };

  const inputStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '8px', // Softer borders
    border: `1px solid ${error ? '#EC5757' : isFocused ? 'var(--accent)' : 'var(--border)'}`,
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    outline: 'none',
    boxShadow: isFocused ? `0 0 0 2px ${error ? 'rgba(236, 87, 87, 0.2)' : 'var(--accent-bg)'}` : 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--sans)',
    width: '100%',
    boxSizing: 'border-box'
  };

  const errorStyle = {
    color: '#EC5757',
    fontSize: '11px',
    marginTop: '6px',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Input;
