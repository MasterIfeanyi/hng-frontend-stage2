import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false, 
  fullWidth = false,
  style = {},
  ...props 
}) => {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '8px', // Slightly smaller border radius for Facebook/Instagram feel
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: '#fff',
      boxShadow: 'var(--shadow)',
    },
    secondary: {
      backgroundColor: 'var(--border)',
      color: 'var(--text-h)',
    },
    danger: {
      backgroundColor: '#EC5757',
      color: '#fff',
      boxShadow: 'var(--shadow)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      if (variant === 'primary') e.currentTarget.style.filter = 'brightness(1.1)';
      if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--text)';
      if (variant === 'secondary') e.currentTarget.style.color = 'var(--bg)';
      if (variant === 'danger') e.currentTarget.style.filter = 'brightness(1.1)';
      if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--border)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      if (variant === 'primary') e.currentTarget.style.filter = 'brightness(1)';
      if (variant === 'secondary') e.currentTarget.style.backgroundColor = variants.secondary.backgroundColor;
      if (variant === 'secondary') e.currentTarget.style.color = variants.secondary.color;
      if (variant === 'danger') e.currentTarget.style.filter = 'brightness(1)';
      if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
