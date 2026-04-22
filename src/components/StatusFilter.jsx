// src/components/StatusFilter.jsx
import { useState, useRef, useEffect } from 'react';

const StatusFilter = ({ currentFilter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const option = filterOptions.find(opt => opt.value === currentFilter);
    return option ? option.label : 'All';
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '50px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'var(--text-h)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s',
          boxShadow: 'var(--shadow)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <span>Filter <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>by status</span></span>
        <span style={{ color: 'var(--accent)', fontSize: '10px' }}>
          {isOpen ? '▲' : '▼'}
        </span>
        {currentFilter !== 'all' && (
          <span style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            marginLeft: '4px'
          }}>
            {getCurrentLabel()}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          marginTop: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          minWidth: '180px',
          zIndex: 10,
          padding: '8px 0',
          overflow: 'hidden'
        }}>
          {filterOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: '12px 24px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: currentFilter === option.value ? 'var(--social-bg)' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--social-bg)'}
              onMouseLeave={(e) => {
                if (currentFilter !== option.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                border: `1px solid ${currentFilter === option.value ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: currentFilter === option.value ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                {currentFilter === option.value && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4.5L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ 
                fontWeight: currentFilter === option.value ? 'bold' : '500',
                color: currentFilter === option.value ? 'var(--text-h)' : 'var(--text)'
              }}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusFilter;