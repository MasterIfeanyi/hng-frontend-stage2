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
          padding: '10px 20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DFE3FA',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#0C0E16',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <span>Filter by status</span>
        <span style={{ color: '#7C5DFA' }}>
          {isOpen ? '▲' : '▼'}
        </span>
        {currentFilter !== 'all' && (
          <span style={{
            backgroundColor: '#7C5DFA',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            marginLeft: '5px'
          }}>
            {getCurrentLabel()}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          left: '0',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DFE3FA',
          borderRadius: '8px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          minWidth: '180px',
          zIndex: 10
        }}>
          {filterOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: currentFilter === option.value ? '#F9FAFE' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFE'}
              onMouseLeave={(e) => {
                if (currentFilter !== option.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="checkbox"
                checked={currentFilter === option.value}
                onChange={() => {}}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ 
                fontWeight: currentFilter === option.value ? 'bold' : 'normal',
                color: currentFilter === option.value ? '#7C5DFA' : '#0C0E16'
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